from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import Profile, User
from .serializers import ProfileSerializer
from django.contrib.auth import login
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class ProfileViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def initial(self, request, *args, **kwargs):
        request._dont_enforce_csrf_checks = True
        super(ProfileViewSet, self).initial(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == 'create' or self.action == 'login':
            self.permission_classes = [AllowAny,]
        else:
            self.permission_classes = [IsAuthenticated,]
        return super(ProfileViewSet, self).get_permissions()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def login(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=user.username, password=password)
        if user is not None:
            login(request, user)
            return Response({"status": "Logged in"})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.request.user.profile
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

