from django.shortcuts import render,HttpResponse,redirect
from django.http import JsonResponse

import requests

# Create your views here.

def check(request):
    if request.session['user_type'] == None:
        print("None")
        redirect(request.META['HTTP_REFERER'])
    else:
        pass



def docCount():
    api_url_docCount = "http://127.0.0.1:3000/doctors/count"
    response = requests.get(api_url_docCount)
    data = response.json()

    return data['count']

def patientCount():
    api_url_patientCount = "http://127.0.0.1:3000/patients/count"
    response = requests.get(api_url_patientCount)
    data2 = response.json()

    return data2['count']

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
    
    if request.session['user_type'] == 'Not':
        redirect('patientLogin')
    else:
        print(request.session['user_type'])
    
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
    api_url = "http://127.0.0.1:3000/doctors"
    response = requests.get(api_url)
    data = response.json()

    userId = request.session['user_id']
    api_url2 = "http://127.0.0.1:3000/patients?number="+userId
    response = requests.get(api_url2)
    data2 = response.json()
    name = data2[0]["first_name"]+" "+data2[0]["last_name"]
    

    context={
        "noDoc":docCount(),
        "noPatient":patientCount(),
        "data":data,
        "name":name,
        "userid":userId,
    }

    return render(request,"patientLandingPage.html",context)

def patientLogin(request):

    if(request.method=='POST'):
        username = request.POST.get("username")
        password = request.POST.get("password")

        api_url = "http://127.0.0.1:3000/patients/login?phone="+username+"&pass="+password
        print(api_url)
        response = requests.get(api_url)
        data = response.json()

        if(data['success']==False):
            return redirect(request.META['HTTP_REFERER'])

        print(data['success'])

        request.session['user_type'] = 'patient'
        request.session['user_id']=username
        

        return redirect('forPatient')

    else:
        print("Get method")
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

    request.session['user_type'] = 'Not'

    return HttpResponse("<h1>Hello World</h1>")



