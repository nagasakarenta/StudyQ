import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Post {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
}

const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'answers'>('posts');

  const userProfile = {
    name: 'Kenji Tanaka',
    username: '@kenji_tanaka',
    avatarUrl: 'https://via.placeholder.com/128',
    posts: 12,
    following: 34,
    followers: 56,
  };

  const posts: Post[] = [
    {
      id: '1',
      title: '大学入試についての質問',
      date: '2024/04/01',
      imageUrl: 'https://via.placeholder.com/56',
    },
    {
      id: '2',
      title: '大学入試についての質問',
      date: '2024/03/15',
      imageUrl: 'https://via.placeholder.com/56',
    },
    {
      id: '3',
      title: '大学入試についての質問',
      date: '2024/02/28',
      imageUrl: 'https://via.placeholder.com/56',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プロフィール</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="settings-outline" size={24} color="#131712" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userUsername}>{userProfile.username}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>プロフィールを編集</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.posts}</Text>
            <Text style={styles.statLabel}>投稿</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.following}</Text>
            <Text style={styles.statLabel}>フォロー</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.followers}</Text>
            <Text style={styles.statLabel}>フォロワー</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              投稿
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'answers' && styles.tabActive]}
            onPress={() => setActiveTab('answers')}
          >
            <Text style={[styles.tabText, activeTab === 'answers' && styles.tabTextActive]}>
              回答
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsList}>
          {posts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
              <View style={styles.postContent}>
                <Text style={styles.postTitle} numberOfLines={1}>
                  {post.title}
                </Text>
                <Text style={styles.postDate}>{post.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131712',
    flex: 1,
    textAlign: 'center',
    paddingLeft: 48,
  },
  settingsButton: {
    width: 48,
    alignItems: 'flex-end',
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#131712',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#6f816a',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#f2f4f1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
    maxWidth: 480,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#131712',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe3dd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#131712',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6f816a',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe3dd',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#131612',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6f816a',
  },
  tabTextActive: {
    color: '#131612',
  },
  postsList: {
    paddingBottom: 20,
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 72,
    backgroundColor: '#fff',
  },
  postImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  postContent: {
    flex: 1,
    justifyContent: 'center',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#131712',
    marginBottom: 4,
  },
  postDate: {
    fontSize: 14,
    color: '#6f816a',
  },
});

export default ProfileScreen;