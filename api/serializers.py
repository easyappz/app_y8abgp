from rest_framework import serializers
from .models import Member, Post, Comment, Like, FriendRequest

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'email', 'bio', 'avatar']

class PublicMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'bio', 'avatar']

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Member
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return Member.objects.create_user(**validated_data)

class PostSerializer(serializers.ModelSerializer):
    author = SimpleUserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'likes_count', 'comments_count']
        read_only_fields = ['created_at']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    author = SimpleUserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at']
        read_only_fields = ['created_at']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'created_at']
