from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    PostListCreateView, PostDetailView, LikeToggleView, CommentListCreateView,
    UserProfileView, UpdateProfileView,
    FriendListView, FriendRequestView, FriendAcceptView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<int:id>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:id>/like/', LikeToggleView.as_view(), name='post_like'),
    path('posts/<int:id>/comments/', CommentListCreateView.as_view(), name='post_comments'),
    
    path('users/me/', UpdateProfileView.as_view(), name='update_profile'),
    path('users/<int:id>/', UserProfileView.as_view(), name='user_profile'),
    
    path('friends/', FriendListView.as_view(), name='friend_list'),
    path('friends/request/', FriendRequestView.as_view(), name='friend_request'),
    path('friends/<int:id>/accept/', FriendAcceptView.as_view(), name='friend_accept'),
]
