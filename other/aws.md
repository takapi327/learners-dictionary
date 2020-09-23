# AWS
## Cost allocation Tags
- コスト配分タグ
- AWS利用明細において、タグ別に利用料金を出力したい場合に利用
> 例えばEC2 Instanceが100台構築されている場合でも、1台1台別のNameタグを付与しておけば、それぞれNameタグ別に利用料を出力することができます。

## AWS Consolidated Billing
- コンソリデーティッドビリング
- 一括請求の処理
- AWS Organizations内の機能

## AWS Budgets
- 予算のしきい値を超えたときにアラートを発信するカスタム予算の設定
- 予算の作成、追跡および調査ができます
> 予約のアラートは、Amazon EC2、Amazon RDS、Amazon Redshift、Amazon ElastiCache、Amazon Elasticsearch の予約でサポートされています。

## AWS Marketplace
- 有資格のパートナーは自社ソフトウェアを AWS カスタマーに販売することができる
- AWS 上で実行されるソフトウェアやサービスを見つけて購入し、すぐに使用を開始することができるオンラインソフトウェアストアです
- ソリューションを構築してビジネスを運営するために必要なサードパーティーのソフトウェア、データ、およびサービスを簡単に検索、購入、デプロイ、管理できるようにする、厳選されたデジタルカタログ

## Amazon Glacier
- 低頻度のアクセスを想定し，運用コストを低く抑えたバックアップ／アーカイブ用のストレージサービス
- データアクセス -> （読み出し）に長時間
- Glacierはアクセスに時間がかかるぶん，費用がS3の約10分の1となっている

## AWS Storage Gateway
- オンプレミスから実質無制限のクラウドストレージへのアクセスを提供するハイブリッドクラウドストレージサービス
- ストレージ管理を簡素化し、主要なハイブリットクラウドストレージのユースケースでコストを削減できます
- ファイルゲートウェイ、テープゲートウェイ、ボリュームゲートウェイの 3 つのゲートウェイタイプが提供されます。

## Amazon S3
- Simple Storage Service (Amazon S3)
- スケーラビリティ、データ可用性、セキュリティ、およびパフォーマンスを提供するオブジェクトストレージサービス

## [Amazon EBS](https://aws.amazon.com/jp/ebs/?ebs-whats-new.sort-by=item.additionalFields.postDateTime&ebs-whats-new.sort-order=desc)
- Elastic Block Store (EBS)
- Amazon Elastic Compute Cloud (EC2) と共に使用するために設計された、スループットとトランザクションの両方が集中するどんな規模のワークロードにも対応できる、使いやすい高性能なブロックストレージサービス
- EBS スナップショットを自動化されたライフサイクルポリシーと共に使用することで Amazon S3 内のボリュームをバックアップし、同時にデータとビジネス継続性の地理的な保護を確実にします

## [Amazon EC2](https://aws.amazon.com/jp/ec2/features/)
- スケーラブルで耐障害性のあるエンタープライズクラスのアプリケーションを構築するために、いくつかの強力な機能を利用できます
- Amazon EBS でバックアップした Amazon EC2 インスタンスを休止させ、休止したときの状態から再開できます

## [AWS Database Migration Service](https://aws.amazon.com/jp/dms/)
- データベースを短期間で安全に AWS に移行できます
- 移行中でもソースデータベースは完全に利用可能な状態
- Oracle から Oracle のような同種のデータベース間の移行も、Oracle または Microsoft SQL から Amazon Aurora といった異なるデータベースプラットフォーム間の移行もサポートされます

## Amazon AppStream 2.0
- フルマネージド型の非永続的なアプリケーションおよびデスクトップストリーミングサービス
- 任意のコンピュータのブラウザへ安全に配信できます

## [AWS Config](https://aws.amazon.com/jp/config/)
- AWS リソースの設定を評価、監査、審査できるサービス
- AWS リソース間の設定や関連性の変更を確認し、詳細なリソース設定履歴を調べ、社内ガイドラインで指定された設定に対する全体的なコンプライアンスを確認できます
- コンプライアンス監査、セキュリティ分析、変更管理、運用上のトラブルシューティングを簡素化できます

## [AWS OpsWorks](https://aws.amazon.com/jp/opsworks/)
- Chef や Puppet のマネージド型インスタンスを利用できるようになる構成管理サービス
- コードを使用してサーバーの構成を自動化できるようにするためのオートメーションプラットフォーム
- Amazon EC2 インスタンスやオンプレミスのコンピューティング環境でのサーバーの設定、デプロイ、管理を自動化できます
- AWS Opsworks for Chef Automate、AWS OpsWorks for Puppet Enterprise、AWS OpsWorks Stacks の 3 つのバージョンがあります

## [AWS SDK](https://aws.amazon.com/jp/sdk-for-net/)
- AWSサービスをプログラムから操作できるSDK
- 各サービスで提供されているAPIをwrapしたもの
- 通信はHTTP/HTTPS
- 各種言語向けのSDKが用意されている

## [Amazon Virtual Private Cloud](https://aws.amazon.com/jp/vpc/)
- 自分の IP アドレス範囲の選択、サブネットの作成、ルートテーブルやネットワークゲートウェイの設定など、仮想ネットワーキング環境を完全に制御できます

## [Amazon Route 53](https://aws.amazon.com/jp/route53/)
- 可用性と拡張性に優れたクラウドのドメインネームシステム (DNS) ウェブサービス
- www.example.com のような名前を、コンピュータが互いに接続するための数字の IP アドレス (192.0.2.1 など) に変換するサービス

## [AWS Direct Connect](https://aws.amazon.com/jp/directconnect/)
- オンプレミスから AWS への専用ネットワーク接続の構築をシンプルにするクラウドサービスソリューション
- お客様のネットワークと AWS Direct Connect のいずれかのロケーションとの間に専用のネットワーク接続を確立することができます
