import random
import requests
from icecream import ic
from .models import Locations, total, today, overview, newss, Covid_huyen, Covid_xa
from datetime import date
from bs4 import BeautifulSoup
import time
random.seed(time.time())
url_data_covid = "https://static.pipezero.com/covid/data.json"
url_donvihanhchinh_tinh = "https://provinces.open-api.vn/api/p/"


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
    json_donvihanhchinh_tinh = get_json_data(url_donvihanhchinh_tinh)
    for i in json_donvihanhchinh_tinh:
        Locations.objects.filter(name='Bà Rịa - Vũng Tàu').update(
            code=77,
        )
        Locations.objects.filter(name='Hoà Bình').update(
            code=17,
        )
        if (Locations.objects.filter(name__contains=i['name'].replace("Tỉnh ", "").replace("Thành phố ", "")).exists()):
            Locations.objects.filter(name__contains=i['name'].replace("Tỉnh ", "").replace("Thành phố ", "")).update(
                code=i['code'],
            )
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
# create class stack in python


class stack:
    def __init__(self):
        self.items = []

    def isEmpty(self):
        return self.items == []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[len(self.items)-1]

    def size(self):
        return len(self.items)


def update_news():
    i = 1
    Stack = stack()
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
                Stack.push({
                    "title": title,
                    "url": link,
                    "image": image,
                    "description": description,
                })
        i += 1
    while Stack.size() > 0:
        news = Stack.pop()
        saving = newss.objects.create(
            title=news["title"],
            url=news["url"],
            image=news["image"],
            description=news["description"],
        )
        saving.save()
    return i


url_xa = "https://provinces.open-api.vn/api/w/"
url_huyen = "https://provinces.open-api.vn/api/d/"


def addAndUpdateXaHuyentoDatabase():
    jsonHuyen = get_json_data(url_huyen)
    for huyen in jsonHuyen:
        if (Covid_huyen.objects.filter(id_huyen=huyen['code']).exists()):
            Covid_huyen.objects.update(
                cases=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).cases/5)),
                death=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).death/5)),
                recovered=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).recovered/5)),
                Today=date.today(),
            )
        else:
            saving = Covid_huyen.objects.create(
                id_huyen=huyen['code'],
                name=huyen['name'],
                id_tinh=Locations.objects.get(code=huyen['province_code']),
                cases=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).cases/5)),
                death=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).death/5)),
                recovered=random.randint(0, int(Locations.objects.get(
                    code=huyen['province_code']).recovered/5)),
                Today=date.today(),
            )
            saving.save()

    jsonXa = get_json_data(url_xa)
    for xa in jsonXa:
        if (Covid_xa.objects.filter(id_xa=xa['code']).exists()):
            Covid_xa.objects.update(
                cases=random.randint(0, int(Covid_huyen.objects.get(
                    id_huyen=xa['district_code']).cases/5)),
                death=random.randint(
                    0, int(Covid_huyen.objects.get(id_xa=xa['district_code']).death/5)),
                recovered=random.randint(
                    0, int(Covid_huyen.objects.get(id_xa=xa['district_code']).recovered/5)),
                Today=date.today(),
            )
        else:
            saving = Covid_xa.objects.create(
                id_xa=xa['code'],
                name=xa['name'],
                id_huyen=Covid_huyen.objects.get(id_huyen=xa['district_code']),
                cases=random.randint(0, int(Covid_huyen.objects.get(
                    id_huyen=xa['district_code']).cases/5)),
                death=random.randint(0, int(Covid_huyen.objects.get(
                    id_huyen=xa['district_code']).death/5)),
                recovered=random.randint(0, int(Covid_huyen.objects.get(
                    id_huyen=xa['district_code']).recovered/5)),
                Today=date.today(),
            )
            saving.save()
