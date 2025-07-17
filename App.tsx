import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import QuestionsScreen from './src/screens/QuestionsScreen';
import QuestionDetailScreen from './src/screens/QuestionDetailScreen';
import NewPostScreen from './src/screens/NewPostScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';

type Screen = 'questions' | 'search' | 'post' | 'profile' | 'questionDetail';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('questions');

  const handleTabPress = (tabName: string) => {
    if (tabName === 'post') {
      setCurrentScreen('post');
    } else {
      setCurrentScreen(tabName as Screen);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'questions':
        return <QuestionsScreen />;
      case 'questionDetail':
        return <QuestionDetailScreen />;
      case 'post':
        return <NewPostScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'search':
        return <QuestionsScreen />;
      default:
        return <QuestionsScreen />;
    }
  };

  const showBottomTabs = currentScreen !== 'post' && currentScreen !== 'questionDetail';

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      {showBottomTabs && (
        <BottomTabNavigator activeTab={currentScreen} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default App;