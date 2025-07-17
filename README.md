# StudyQ - 学習Q&Aアプリ

## 概要
StudyQは、学生向けの質問・回答プラットフォームです。学習、キャリア、大学受験などに関する質問を投稿し、コミュニティから回答を得ることができます。

## 主な機能

### 1. 質問機能
- 質問の投稿（テキスト + 画像）
- カテゴリー分類（学習、キャリア、大学受験、その他）
- 質問の検索・フィルタリング
- いいね・コメント機能

### 2. 回答機能
- 質問への回答投稿
- 回答へのリアクション

### 3. ユーザー機能
- プロフィール管理
- フォロー/フォロワー機能
- 投稿・回答履歴の閲覧

### 4. コイン機能
- 質問投稿にコインを消費（1コイン/質問）
- コインの購入（アプリ内課金）
- 残高確認

### 5. AI先生機能
- OpenAI APIを使用した即時回答提供
- 質問の自動カテゴリー分類
- 学習レベルに応じた回答の調整
- 回答の信頼度表示

## 推奨アーキテクチャ

### ディレクトリ構造
```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── common/         # 汎用コンポーネント
│   ├── questions/      # 質問関連コンポーネント
│   └── profile/        # プロフィール関連コンポーネント
├── screens/            # 画面コンポーネント
├── navigation/         # ナビゲーション設定
├── services/           # 外部サービスとの連携
│   ├── firebase/       # Firebase関連
│   ├── revenueCat/     # RevenueCat関連
│   ├── openai/         # OpenAI API関連
│   ├── admob/          # Google AdMob関連
│   └── api/           # API通信
├── hooks/              # カスタムフック
├── store/              # 状態管理（Redux/Zustand）
│   ├── slices/         # Redux slices
│   └── actions/        # アクション定義
├── utils/              # ユーティリティ関数
├── types/              # TypeScript型定義
└── constants/          # 定数定義
```

### 技術スタック

#### フロントエンド
- **React Native** - クロスプラットフォーム開発
- **TypeScript** - 型安全性
- **React Navigation** - 画面遷移管理
- **Redux Toolkit** or **Zustand** - 状態管理
- **React Hook Form** - フォーム管理
- **React Query** - サーバー状態管理

#### バックエンド (Firebase)
- **Firebase Authentication** - ユーザー認証
- **Cloud Firestore** - NoSQLデータベース
- **Cloud Storage** - 画像ストレージ
- **Cloud Functions** - サーバーレス関数
- **Firebase Analytics** - 分析
- **Cloud Messaging** - プッシュ通知

#### 決済
- **RevenueCat** - サブスクリプション管理
  - iOS/Android両対応
  - 購入処理の統一化
  - サブスクリプション状態管理

#### AI・機械学習
- **OpenAI API** - AI回答生成
  - GPT-4/GPT-3.5による自然言語処理
  - 文脈に応じた回答生成
  - プロンプトエンジニアリング

#### 広告
- **Google AdMob** - 広告収益化
  - バナー広告
  - インタースティシャル広告
  - リワード広告（コイン獲得）

### データモデル

#### Users Collection
```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  coinBalance: number;
  followingCount: number;
  followersCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscription?: {
    isActive: boolean;
    plan: 'basic' | 'premium';
    expiresAt?: Timestamp;
  };
}
```

#### Questions Collection
```typescript
interface Question {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: '数学' | '国語' | '社会' | '理科';
  imageUrls?: string[];
  likeCount: number;
  answerCount: number;
  isAIAnswered: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Answers Collection
```typescript
interface Answer {
  id: string;
  questionId: string;
  userId: string;
  content: string;
  likeCount: number;
  isAI: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Transactions Collection
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'consume' | 'reward';
  amount: number;
  description: string;
  relatedId?: string; // questionId, etc.
  createdAt: Timestamp;
}
```

### Firebase設定

#### Firestore セキュリティルール例
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー認証の確認
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 本人確認
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // ユーザードキュメント
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    // 質問ドキュメント
    match /questions/{questionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow delete: if false; // 削除は禁止
    }
    
    // 回答ドキュメント
    match /answers/{answerId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow delete: if false; // 削除は禁止
    }
  }
}
```

### OpenAI API統合

#### AI回答サービス実装
```typescript
// src/services/openai/aiService.ts
import axios from 'axios';
import Config from 'react-native-config';

interface AIResponse {
  answer: string;
  confidence: number;
  sources?: string[];
}

export class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = Config.OPENAI_API_KEY;
    this.model = Config.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async generateAnswer(question: string, category: string): Promise<AIResponse> {
    try {
      const prompt = this.createPrompt(question, category);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '学生の学習支援を行うAI教師です。分かりやすく、教育的な回答を心がけてください。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return {
        answer: response.data.choices[0].message.content,
        confidence: this.calculateConfidence(response.data.choices[0]),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('AI回答の生成に失敗しました');
    }
  }

  private createPrompt(question: string, category: string): string {
    return `
カテゴリー: ${category}
質問: ${question}

この質問に対して、高校生や大学生にとって分かりやすい回答を提供してください。
必要に応じて例や説明を含めてください。
    `.trim();
  }

  private calculateConfidence(choice: any): number {
    // 簡易的な信頼度計算（実際にはより複雑なロジックを実装）
    return choice.finish_reason === 'stop' ? 0.85 : 0.65;
  }
}
```

#### Firebase Functions連携
```typescript
// functions/src/aiAnswers.ts
import * as functions from 'firebase-functions';
import { AIService } from './services/aiService';
import admin from 'firebase-admin';

export const generateAIAnswer = functions.https.onCall(async (data, context) => {
  // 認証チェック
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  const { questionId, question, category } = data;
  const aiService = new AIService();

  try {
    // AI回答生成
    const aiResponse = await aiService.generateAnswer(question, category);
    
    // Firestoreに保存
    await admin.firestore().collection('answers').add({
      questionId,
      userId: 'ai-teacher',
      content: aiResponse.answer,
      isAI: true,
      confidence: aiResponse.confidence,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 質問のAI回答フラグを更新
    await admin.firestore().collection('questions').doc(questionId).update({
      isAIAnswered: true,
      aiAnsweredAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, answer: aiResponse };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'AI回答の生成に失敗しました');
  }
});
```

### Google AdMob統合

#### AdMob設定
```typescript
// src/services/admob/config.ts
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from 'react-native-admob';
import Config from 'react-native-config';
import { Platform } from 'react-native';

export const AdMobConfig = {
  appId: Platform.select({
    ios: Config.ADMOB_APP_ID_IOS,
    android: Config.ADMOB_APP_ID_ANDROID,
  }),
  bannerId: Platform.select({
    ios: Config.ADMOB_BANNER_ID_IOS,
    android: Config.ADMOB_BANNER_ID_ANDROID,
  }),
  interstitialId: Platform.select({
    ios: Config.ADMOB_INTERSTITIAL_ID_IOS,
    android: Config.ADMOB_INTERSTITIAL_ID_ANDROID,
  }),
  rewardId: Platform.select({
    ios: Config.ADMOB_REWARD_ID_IOS,
    android: Config.ADMOB_REWARD_ID_ANDROID,
  }),
};

// テスト用ID（開発時に使用）
export const TestIds = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};
```

#### 広告コンポーネント
```typescript
// src/components/ads/BannerAd.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner } from 'react-native-admob';
import { AdMobConfig } from '../../services/admob/config';

interface BannerAdProps {
  isVisible?: boolean;
}

export const BannerAd: React.FC<BannerAdProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <AdMobBanner
        adSize="smartBanner"
        adUnitID={AdMobConfig.bannerId}
        onAdFailedToLoad={(error) => console.error('Banner Ad Error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
  },
});
```

#### リワード広告フック
```typescript
// src/hooks/useRewardAd.ts
import { useState, useEffect } from 'react';
import { AdMobRewarded } from 'react-native-admob';
import { AdMobConfig } from '../services/admob/config';

export const useRewardAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEarned, setIsEarned] = useState(false);

  useEffect(() => {
    AdMobRewarded.setAdUnitID(AdMobConfig.rewardId!);
    
    AdMobRewarded.addEventListener('rewarded', (reward) => {
      console.log('User earned reward:', reward);
      setIsEarned(true);
    });

    AdMobRewarded.addEventListener('adLoaded', () => {
      setIsLoaded(true);
    });

    AdMobRewarded.addEventListener('adFailedToLoad', (error) => {
      console.error('Reward Ad Error:', error);
      setIsLoaded(false);
    });

    AdMobRewarded.requestAd();

    return () => {
      AdMobRewarded.removeAllListeners();
    };
  }, []);

  const showRewardAd = async () => {
    if (isLoaded) {
      try {
        await AdMobRewarded.showAd();
      } catch (error) {
        console.error('Failed to show reward ad:', error);
      }
    }
  };

  return {
    isLoaded,
    isEarned,
    showRewardAd,
  };
};
```

#### 広告表示ロジック
```typescript
// src/utils/adManager.ts
export class AdManager {
  private static instance: AdManager;
  private questionCount: number = 0;
  private lastInterstitialTime: number = 0;

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  shouldShowBanner(isPremium: boolean): boolean {
    return !isPremium;
  }

  shouldShowInterstitial(): boolean {
    this.questionCount++;
    const timeSinceLastAd = Date.now() - this.lastInterstitialTime;
    const minInterval = 3 * 60 * 1000; // 3分

    if (this.questionCount >= 5 && timeSinceLastAd > minInterval) {
      this.questionCount = 0;
      this.lastInterstitialTime = Date.now();
      return true;
    }
    return false;
  }
}
```

### RevenueCat統合

#### 製品設定
```typescript
// src/constants/products.ts
export const PRODUCTS = {
  COINS: {
    PACK_10: 'com.studyq.coins.10',
    PACK_50: 'com.studyq.coins.50',
    PACK_100: 'com.studyq.coins.100',
  },
  SUBSCRIPTIONS: {
    PREMIUM_MONTHLY: 'com.studyq.premium.monthly',
    PREMIUM_YEARLY: 'com.studyq.premium.yearly',
  },
};

// プレミアム特典
export const PREMIUM_FEATURES = {
  UNLIMITED_QUESTIONS: true,
  AI_ANSWERS: true,
  AD_FREE: true,
  PRIORITY_SUPPORT: true,
};
```

#### RevenueCat初期化
```typescript
// src/services/revenueCat/config.ts
import Purchases from 'react-native-purchases';

export const initializeRevenueCat = async () => {
  Purchases.setDebugLogsEnabled(__DEV__);
  
  if (Platform.OS === 'ios') {
    await Purchases.configure({ apiKey: 'YOUR_IOS_API_KEY' });
  } else {
    await Purchases.configure({ apiKey: 'YOUR_ANDROID_API_KEY' });
  }
};
```

### 実装の優先順位

1. **Phase 1: MVP (1-2ヶ月)**
   - ユーザー認証（Firebase Auth）
   - 質問の投稿・一覧表示
   - 基本的な回答機能
   - プロフィール機能

2. **Phase 2: コア機能 (1ヶ月)**
   - コイン機能
   - RevenueCat統合
   - 画像アップロード
   - 検索・フィルタリング

3. **Phase 3: 拡張機能 (1-2ヶ月)**
   - AI先生機能
   - フォロー機能
   - プッシュ通知
   - アナリティクス

4. **Phase 4: 最適化 (継続的)**
   - パフォーマンス改善
   - UI/UX改善
   - A/Bテスト
   - ユーザーフィードバック対応

### 環境設定

#### 必要な環境変数
```bash
# .env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

REVENUECAT_IOS_API_KEY=your_ios_api_key
REVENUECAT_ANDROID_API_KEY=your_android_api_key

OPENAI_API_KEY=your_openai_api_key # AI先生機能用
OPENAI_MODEL=gpt-3.5-turbo # 使用するモデル

ADMOB_APP_ID_IOS=your_ios_admob_app_id
ADMOB_APP_ID_ANDROID=your_android_admob_app_id
ADMOB_BANNER_ID_IOS=your_ios_banner_id
ADMOB_BANNER_ID_ANDROID=your_android_banner_id
ADMOB_INTERSTITIAL_ID_IOS=your_ios_interstitial_id
ADMOB_INTERSTITIAL_ID_ANDROID=your_android_interstitial_id
ADMOB_REWARD_ID_IOS=your_ios_reward_id
ADMOB_REWARD_ID_ANDROID=your_android_reward_id
```

### セットアップ手順

1. **プロジェクトのクローン**
   ```bash
   git clone https://github.com/nagasakarenta/StudyQ.git
   cd StudyQ
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   
   # AdMob関連
   npm install react-native-admob @react-native-firebase/admob
   
   # OpenAI関連
   npm install axios react-native-config
   
   # iOS用
   cd ios && pod install
   ```

3. **Firebase設定**
   - Firebaseコンソールでプロジェクト作成
   - iOS/Android用の設定ファイルをダウンロード
   - `google-services.json` (Android) を `android/app/` に配置
   - `GoogleService-Info.plist` (iOS) を `ios/` に配置

4. **RevenueCat設定**
   - RevenueCatダッシュボードでアプリ登録
   - APIキーを取得して環境変数に設定
   - App Store/Google Playで製品を作成

5. **OpenAI設定**
   - OpenAIアカウント作成
   - APIキーを取得
   - 使用制限とコスト管理の設定

6. **Google AdMob設定**
   - AdMobアカウント作成
   - アプリを登録
   - 広告ユニットを作成（バナー、インタースティシャル、リワード）
   - iOS: Info.plistにGADApplicationIdentifierを追加
   ```xml
   <key>GADApplicationIdentifier</key>
   <string>ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy</string>
   ```
   - Android: AndroidManifest.xmlにメタデータを追加
   ```xml
   <meta-data
     android:name="com.google.android.gms.ads.APPLICATION_ID"
     android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
   ```

7. **開発サーバー起動**
   ```bash
   npm start
   npm run ios # or npm run android
   ```

### パフォーマンス最適化

1. **画像最適化**
   - react-native-fast-imageの使用
   - 適切なキャッシュ戦略
   - 画像の遅延読み込み

2. **リスト最適化**
   - FlatListの最適化
   - メモ化の活用
   - 仮想化リストの実装

3. **状態管理最適化**
   - 正規化されたデータ構造
   - セレクタの最適化
   - 不要な再レンダリング防止

### セキュリティ考慮事項

1. **認証・認可**
   - Firebase Authによる認証
   - ロールベースアクセス制御
   - セキュアなトークン管理

2. **データ保護**
   - 個人情報の暗号化
   - HTTPSの使用
   - 適切なFirestoreルール

3. **決済セキュリティ**
   - RevenueCatによる安全な決済処理
   - サーバーサイドでの購入検証
   - 不正利用防止

### モニタリング・分析

1. **Firebase Analytics**
   - ユーザー行動追跡
   - カスタムイベント設定
   - コンバージョン分析

2. **Crashlytics**
   - クラッシュレポート
   - エラー追跡
   - パフォーマンスモニタリング

3. **RevenueCat Analytics**
   - 収益分析
   - サブスクリプション分析
   - チャーン率追跡
