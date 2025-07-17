import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Question {
  id: string;
  title: string;
  category: string;
  answerCount: number;
  imageUrl: string;
}

const QuestionsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('すべて');

  const filters = ['すべて', '学習', 'キャリア', 'その他', '自分', 'フォロー中'];
  
  const questions: Question[] = [
    {
      id: '1',
      title: '大学入試に向けて、効率的な学習方法は？',
      category: '学習',
      answerCount: 12,
      imageUrl: 'https://via.placeholder.com/56',
    },
    {
      id: '2',
      title: '学習のモチベーションを維持するためにはどうすればいいでしょうか？',
      category: '学習',
      answerCount: 8,
      imageUrl: 'https://via.placeholder.com/56',
    },
    {
      id: '3',
      title: '大学での学習とキャリアの関係について、どのように考えればいいでしょうか？',
      category: 'キャリア',
      answerCount: 15,
      imageUrl: 'https://via.placeholder.com/56',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>質問</Text>
        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={24} color="#131712" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={24} color="#6d8566" style={styles.searchBarIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="検索"
            placeholderTextColor="#6d8566"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.questionsList}>
        {questions.map((question) => (
          <TouchableOpacity key={question.id} style={styles.questionItem}>
            <Image source={{ uri: question.imageUrl }} style={styles.questionImage} />
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle} numberOfLines={1}>
                {question.title}
              </Text>
              <Text style={styles.questionCategory}>{question.category}</Text>
            </View>
            <Text style={styles.answerCount}>{question.answerCount}</Text>
          </TouchableOpacity>
        ))}
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
  searchIcon: {
    width: 48,
    alignItems: 'flex-end',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4f1',
    borderRadius: 12,
    height: 48,
  },
  searchBarIcon: {
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#131712',
  },
  filterContainer: {
    maxHeight: 56,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f1f4f1',
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  filterChipActive: {
    backgroundColor: '#131712',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#131712',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  questionsList: {
    flex: 1,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 72,
    backgroundColor: '#fff',
  },
  questionImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#131712',
    marginBottom: 4,
  },
  questionCategory: {
    fontSize: 14,
    color: '#6d8566',
  },
  answerCount: {
    fontSize: 16,
    color: '#131712',
  },
});

export default QuestionsScreen;