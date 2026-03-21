from rest_framework import generics
from .models import Product , Cart
from .serializers import ProductSerializer, CartSerializer
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView 
from django.contrib.auth import authenticate


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

from rest_framework.permissions import AllowAny   

class CartListCreateView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()  
    serializer_class = CartSerializer
    permission_classes = [AllowAny]   

    def perform_create(self, serializer):
        serializer.save()   
class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class LoginView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])

        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username
        })

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)        


class LoginView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user_id": user.id,
                "username": user.username
            })

        return Response({"error": "Invalid Credentials"})
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .models import Order
from .serializers import OrderSerializer

class MyOrdersView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, Order

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart_items = Cart.objects.filter(user=user)

        for item in cart_items:
            Order.objects.create(
                user=user,
                product=item.product,
                quantity=item.quantity
            )

        cart_items.delete()

        return Response({"message": "Order placed successfully"})    