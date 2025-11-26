from django.contrib import admin
from .models import Member, Post, Comment, Like, FriendRequest

admin.site.register(Member)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(FriendRequest)
