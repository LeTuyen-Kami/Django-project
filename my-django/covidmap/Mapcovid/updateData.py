import requests
import json
from .models import Locations, total, today, overview
from datetime import date
url_data_covid="https://static.pipezero.com/covid/data.json"


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
                    casesToday=i['casesToday']
                )
            else:
                saving = Locations.objects.create(
                    name=i['name'],
                    cases=i['cases'],
                    death=i['death'],
                    casesToday=i['casesToday']
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
        list_today = ['internal','world']
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
