from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from rest_framework import generics, views, status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from .models import Member, Post, Comment, Like, FriendRequest
from .serializers import (
    MemberSerializer, RegisterSerializer, PostSerializer, 
    CommentSerializer, SimpleUserSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class RegisterView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({'detail': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserProfileView(generics.RetrieveAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    lookup_field = 'id'

class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
             raise PermissionDenied("Authentication required")
        serializer.save(author=self.request.user)

class PostDetailView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
             raise PermissionDenied("Not authorized to delete this post")
        instance.delete()

class LikeToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        post = get_object_or_404(Post, id=id)
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({
            'liked': liked,
            'likes_count': post.likes.count()
        })

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
             raise PermissionDenied("Authentication required")
        post = get_object_or_404(Post, id=self.kwargs['id'])
        serializer.save(author=self.request.user, post=post)

class FriendListView(generics.ListAPIView):
    serializer_class = SimpleUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.friends.all()

class FriendRequestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        to_user_id = request.data.get('user_id')
        if not to_user_id:
            return Response({'detail': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if to_user_id == request.user.id:
             return Response({'detail': 'Cannot add self'}, status=status.HTTP_400_BAD_REQUEST)
        
        to_user = get_object_or_404(Member, id=to_user_id)
        
        if request.user.friends.filter(id=to_user_id).exists():
            return Response({'detail': 'Already friends'}, status=status.HTTP_400_BAD_REQUEST)
            
        if FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists():
            return Response({'detail': 'Request already sent'}, status=status.HTTP_400_BAD_REQUEST)
            
        FriendRequest.objects.create(from_user=request.user, to_user=to_user)
        return Response({'detail': 'Request sent'}, status=status.HTTP_201_CREATED)

class FriendAcceptView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, id):
        friend_request = get_object_or_404(FriendRequest, from_user_id=id, to_user=request.user)
        
        request.user.friends.add(friend_request.from_user)
        friend_request.delete()
        return Response({'detail': 'Friend request accepted'}, status=status.HTTP_200_OK)
