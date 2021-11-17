import requests
import json
from .models import Locations, total, today, overview, newss
from datetime import date
from bs4 import BeautifulSoup
url_data_covid = "https://static.pipezero.com/covid/data.json"


def get_json_data(url):
    response = requests.get(url)
    return response.json()


def udatedata():
    json_data_covid = get_json_data(url_data_covid)
    for i in json_data_covid['locations']:
        if (Locations.objects.filter(name=i['name']).exists()):
            saving = Locations.objects.filter(name=i['name']).update(
                name=i['name'],
                cases=i['cases'],
                death=i['death'],
                casesToday=i['casesToday'],
                Today=date.today(),
            )
        else:
            saving = Locations.objects.create(
                name=i['name'],
                cases=i['cases'],
                death=i['death'],
                casesToday=i['casesToday'],
                Today=date.today(),
            )
            saving.save()
    for i in json_data_covid['overview']:
        if (overview.objects.filter(date=i['date']).exists()):
            saving = overview.objects.filter(date=i['date']).update(
                date=i['date'],
                death=i['death'],
                treating=i['treating'],
                cases=i['cases'],
                recovered=i['recovered'],
                avgCases7day=i['avgCases7day'],
                avgRecovered7day=i['avgRecovered7day'],
                avgDeath7day=i['avgDeath7day'],
            )

        else:
            saving = overview.objects.create(
                date=i['date'],
                death=i['death'],
                treating=i['treating'],
                cases=i['cases'],
                recovered=i['recovered'],
                avgCases7day=i['avgCases7day'],
                avgRecovered7day=i['avgRecovered7day'],
                avgDeath7day=i['avgDeath7day'],
            )
            saving.save()
        # loop
    list_today = ['internal', 'world']
    for i in list_today:
        if (today.objects.filter(today_type=i).exists()):
            saving = today.objects.filter(today_type=i).update(
                death=json_data_covid['today'][i]['death'],
                treating=json_data_covid['today'][i]['treating'],
                cases=json_data_covid['today'][i]['cases'],
                recovered=json_data_covid['today'][i]['recovered'],
                Today=date.today(),
                today_type=i,
            )
        else:
            saving = today.objects.create(
                death=json_data_covid['today'][i]['death'],
                treating=json_data_covid['today'][i]['treating'],
                cases=json_data_covid['today'][i]['cases'],
                recovered=json_data_covid['today'][i]['recovered'],
                Today=date.today(),
                today_type=i,
            )
            saving.save()
        if (total.objects.filter(total_type=i).exists()):
            saving = total.objects.filter(total_type=i).update(
                death=json_data_covid['total'][i]['death'],
                treating=json_data_covid['total'][i]['treating'],
                cases=json_data_covid['total'][i]['cases'],
                recovered=json_data_covid['total'][i]['recovered'],
                Today=date.today(),
                total_type=i,
            )
        else:
            saving = total.objects.create(
                death=json_data_covid['today'][i]['death'],
                treating=json_data_covid['today'][i]['treating'],
                cases=json_data_covid['today'][i]['cases'],
                recovered=json_data_covid['today'][i]['recovered'],
                Today=date.today(),
                total_type=i,
            )
            saving.save()


url_news = "https://covid19.gov.vn/timelinelist/1711565/{}.htm"
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}


def update_news():
    i = 1
    while True:
        response = requests.get(url_news.format(i), headers=headers)
        parser = BeautifulSoup(response.text, "html.parser")
        contents = parser.find_all("div", {"class": "box-stream-item"})
        if len(contents) == 0:
            break
        for content in contents:
            title = content.find(
                "a", class_="box-stream-link-with-avatar img-resize").get("title")
            link = content.find(
                "a", class_="box-stream-link-with-avatar img-resize")["href"]
            image = content.find("img")["src"]
            description = content.find(
                "div", class_="box-stream-content").find("p").text
            if (not newss.objects.filter(title=title).exists()):
                saving = newss.objects.create(
                    title=title,
                    url=link,
                    description=description,
                    image=image,
                )
                saving.save()
        i += 1
    return i
