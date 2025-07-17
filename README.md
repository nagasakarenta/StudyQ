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
- AIによる即時回答提供
- 質問の自動カテゴリー分類

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
```

### セットアップ手順

1. **プロジェクトのクローン**
   ```bash
   git clone https://github.com/yourusername/StudyQ.git
   cd StudyQ
   ```

2. **依存関係のインストール**
   ```bash
   npm install
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

5. **開発サーバー起動**
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
