import React from 'react';
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

interface Answer {
  id: string;
  userName: string;
  userImage: string;
  date: string;
  content: string;
}

const QuestionDetailScreen: React.FC = () => {
  const question = {
    title: '大学受験に向けて、効率的な学習方法は？',
    date: '2024年1月15日',
    category: '大学受験',
    content: '大学受験に向けて、効率的な学習方法を探しています。学習の効率を最大化するためのアプローチをお教えいただけますか？',
    imageUrl: 'https://via.placeholder.com/70',
    likes: 12,
    comments: 3,
  };

  const answers: Answer[] = [
    {
      id: '1',
      userName: 'Ethan',
      userImage: 'https://via.placeholder.com/40',
      date: '2024年1月16日',
      content: '学習の効率を高めるには、学習スタイルに合わせた学習方法を見つけることが重要です。視覚的に学ぶのが得意ならフラッシュカードや図を利用し、聴覚的に学ぶのが得意なら講義のレコードを聴くのがいいでしょう。',
    },
    {
      id: '2',
      userName: 'Olivia',
      userImage: 'https://via.placeholder.com/40',
      date: '2024年1月17日',
      content: '学習の効率を高めるには、時間管理が重要です。',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#131612" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>質問</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionHeader}>
          <Image source={{ uri: question.imageUrl }} style={styles.questionImage} />
          <View style={styles.questionInfo}>
            <Text style={styles.questionTitle}>{question.title}</Text>
            <Text style={styles.questionDate}>{question.date}</Text>
            <Text style={styles.questionCategory}>{question.category}</Text>
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart-outline" size={24} color="#6f816a" />
            <Text style={styles.actionCount}>{question.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={24} color="#6f816a" />
            <Text style={styles.actionCount}>{question.comments}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.answersTitle}>回答</Text>

        {answers.map((answer) => (
          <View key={answer.id} style={styles.answerItem}>
            <Image source={{ uri: answer.userImage }} style={styles.answerUserImage} />
            <View style={styles.answerContent}>
              <View style={styles.answerHeader}>
                <Text style={styles.answerUserName}>{answer.userName}</Text>
                <Text style={styles.answerDate}>{answer.date}</Text>
              </View>
              <Text style={styles.answerText}>{answer.content}</Text>
            </View>
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131612',
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
  },
  content: {
    flex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  questionImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  questionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#131612',
    marginBottom: 4,
  },
  questionDate: {
    fontSize: 14,
    color: '#6f816a',
    marginBottom: 2,
  },
  questionCategory: {
    fontSize: 14,
    color: '#6f816a',
  },
  questionContent: {
    fontSize: 16,
    color: '#131612',
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6f816a',
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131612',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  answerItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  answerUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  answerContent: {
    flex: 1,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  answerUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#131612',
  },
  answerDate: {
    fontSize: 14,
    color: '#6f816a',
  },
  answerText: {
    fontSize: 14,
    color: '#131612',
    lineHeight: 20,
  },
});

export default QuestionDetailScreen;