import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface TabItem {
  name: string;
  icon: string;
  iconActive?: string;
  label: string;
}

interface BottomTabNavigatorProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({ activeTab, onTabPress }) => {
  const tabs: TabItem[] = [
    { name: 'questions', icon: 'help-circle-outline', iconActive: 'help-circle', label: '質問' },
    { name: 'search', icon: 'search-outline', iconActive: 'search', label: '検索' },
    { name: 'post', icon: 'add-outline', iconActive: 'add', label: '投稿' },
    { name: 'profile', icon: 'person-outline', iconActive: 'person', label: 'プロフィール' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          const iconName = isActive && tab.iconActive ? tab.iconActive : tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => onTabPress(tab.name)}
            >
              <Icon
                name={iconName}
                size={24}
                color={isActive ? '#131712' : '#6d8566'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.safeAreaBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f4f1',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#131712',
  },
  tabLabelInactive: {
    color: '#6d8566',
  },
  safeAreaBottom: {
    height: 20,
    backgroundColor: '#fff',
  },
});

export default BottomTabNavigator;