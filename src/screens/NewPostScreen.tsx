import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const NewPostScreen: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    { value: '', label: 'カテゴリーを選択' },
    { value: '学習', label: '学習' },
    { value: 'キャリア', label: 'キャリア' },
    { value: '大学受験', label: '大学受験' },
    { value: 'その他', label: 'その他' },
  ];

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0].uri || null);
      }
    });
  };

  const handlePost = () => {
    console.log('Posting:', { question, selectedCategory, selectedImage });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton}>
            <Icon name="close" size={24} color="#131712" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>新規投稿</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.questionInput}
              placeholder="質問を入力"
              placeholderTextColor="#6d8566"
              multiline
              value={question}
              onChangeText={setQuestion}
            />
          </View>

          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Icon name="close-circle" size={24} color="#131712" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
              <Icon name="image-outline" size={48} color="#6d8566" />
              <Text style={styles.imagePickerText}>画像を追加</Text>
            </TouchableOpacity>
          )}

          <View style={styles.categoryContainer}>
            <View style={styles.categorySelector}>
              <Text style={[styles.categoryText, !selectedCategory && styles.placeholderText]}>
                {selectedCategory || 'カテゴリーを選択'}
              </Text>
              <Icon name="chevron-down" size={20} color="#6d8566" />
            </View>
          </View>

          <Text style={styles.coinInfo}>投稿には1コインが必要です。残高：5コイン</Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>AI先生に質問</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.postButton, !question && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!question}
          >
            <Text style={styles.postButtonText}>投稿する</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131712',
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  questionInput: {
    backgroundColor: '#f1f4f1',
    borderRadius: 12,
    padding: 16,
    minHeight: 144,
    fontSize: 16,
    color: '#131712',
    textAlignVertical: 'top',
  },
  imageContainer: {
    margin: 16,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  imagePickerButton: {
    margin: 16,
    backgroundColor: '#f1f4f1',
    aspectRatio: 3 / 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6d8566',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categorySelector: {
    backgroundColor: '#f1f4f1',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 16,
    color: '#131712',
  },
  placeholderText: {
    color: '#6d8566',
  },
  coinInfo: {
    fontSize: 14,
    color: '#6d8566',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f4f1',
  },
  aiButton: {
    flex: 1,
    backgroundColor: '#f1f4f1',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#131712',
  },
  postButton: {
    flex: 1,
    backgroundColor: '#50d22c',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#f1f4f1',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#131712',
  },
});

export default NewPostScreen;