from django.shortcuts import render,HttpResponse
from django.http import JsonResponse

import requests

# Create your views here.


def forDoctor(request):
    api_url = "http://127.0.0.1:3000/appointments"
    response = requests.get(api_url)
    data = response.json()
    
    forwarded = []
    pending = []
    for gn in data:
        if( gn['status']=='forwarded' ):
            forwarded.append(gn)
        if( gn['status']=='pending' ):
            pending.append(gn)

    context={
        'data':data,
        'forwarded':forwarded,
        'pending':pending,
    }
    return render(request,"doctorsLandingPage.html",context)


def forDoctor2(request,id):
    api_url = "http://127.0.0.1:3000/appointments"
    response = requests.get(api_url)
    data = response.json()

    api_url2 = f"http://127.0.0.1:3000/patients?number={id}"
    response2 = requests.get(api_url2)
    patient = response2.json()
    print(id)
    print(patient)
    forwarded = []
    pending = []
    for gn in data:
        if( gn['status']=='forwarded' ):
            forwarded.append(gn)
        if( gn['status']=='pending' ):
            pending.append(gn)

    context={
        'data':data,
        'forwarded':forwarded,
        'pending':pending,
        'patient':patient[0],
    }
    return render(request,"doctorsLandingPage2.html",context)


def forDesk(request):
    api_url = "http://127.0.0.1:3000/doctors"
    response = requests.get(api_url)
    data = response.json()

    noDoc = len(data)

    api_url2 = "http://127.0.0.1:3000/appointments"
    response2 = requests.get(api_url2)
    data2 = response2.json()




    api_url3 = "http://127.0.0.1:3000/appointments"
    response3 = requests.get(api_url3)
    data3 = response3.json()
    
    noPatient = len(data3)

    context = {
        'data':data,
        'patient':data2,
        'noDoc':noDoc,
        'noPatient':noPatient
    }
    return render(request,'deskLandingPage.html',context)

def forPatient(request):


    return render(request,"patientLandingPage.html")

def patientLogin(request):
    return render(request,'patientLogin.html')

def managerLogin(request):
    return render(request,'managerLogin.html')

def doctorLogin(request):
    return render(request,'doctorLogin.html')

def allDoc(request):
    api_url = "http://127.0.0.1:3000/doctors"
    response = requests.get(api_url)
    data = response.json()

    context = {
        'data':data,
    }

    return render(request,'docList.html',context)

def appointDone(request,id):
    # api_url = "http://127.0.0.1:3000/appointments"
    # response = requests.get(api_url)
    # data = response.json()
    
    # forwarded = []
    # pending = []
    # for gn in data:
    #     if( gn['status']=='forwarded' ):
    #         forwarded.append(gn)
    #     if( gn['status']=='pending' ):
    #         pending.append(gn)

    # context={
    #     'data':data,
    #     'forwarded':forwarded,
    #     'pending':pending,
    # }

    forDoctor(request)

    # render(request,"doctorsLandingPage.html",context)

def home(request):



    return HttpResponse("<h1>Hello World</h1>")



