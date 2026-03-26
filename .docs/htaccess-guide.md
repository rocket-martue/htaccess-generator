# .htaccess ディレクティブ・フラグ解説ガイド

WordPress環境（XServer）で使用する `.htaccess` の主要ディレクティブとフラグについてまとめたガイドです。

---

## HTTPSリダイレクトルールの仕組み

```apache
RewriteCond %{HTTPS} !=on [NC]
RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

### 各行の役割

**1行目: `RewriteCond %{HTTPS} !=on [NC]`**

現在のアクセスがHTTPS接続でないことを確認する条件。直接サーバーにHTTPSで接続している場合はこの条件に合致せず、リダイレクトは発生しない。

**2行目: `RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]`**

リバースプロキシやCDN（Cloudflare、AWS ALBなど）を経由しているケースに対応するための条件。

以下のような構成の場合:

```
ユーザー →(HTTPS)→ CDN/プロキシ →(HTTP)→ サーバー
```

サーバーから見るとHTTPアクセスに見えるが、実際にはユーザーはHTTPSでアクセスしている。プロキシが付与する `X-Forwarded-Proto` ヘッダーで元のプロトコルを判定する。

> **この行がないと、プロキシ経由のHTTPSアクセスで無限リダイレクトループが発生する。**

**3行目: `RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`**

上記2つの条件が両方とも真の場合（= 本当にHTTPアクセスの場合）のみ、HTTPSのURLへ301リダイレクトを実行する。

---

## RewriteCond（条件ディレクティブ）

「次の `RewriteRule` を実行するかどうか」を判定する条件文。プログラミングにおける `if` 文に相当する。

### 構文

```apache
RewriteCond %{テスト文字列} パターン [フラグ]
```

### 主要なテスト文字列（サーバー変数）

| 変数 | 内容 |
|---|---|
| `%{HTTPS}` | HTTPS接続なら `on` |
| `%{HTTP_USER_AGENT}` | ブラウザやbotのUA文字列 |
| `%{REQUEST_URI}` | リクエストされたパス（例: `/wp-admin/`） |
| `%{REQUEST_FILENAME}` | サーバー上の実ファイルパス |
| `%{QUERY_STRING}` | `?` 以降のクエリ文字列 |
| `%{THE_REQUEST}` | 生のHTTPリクエスト行（例: `GET /path HTTP/1.1`） |
| `%{HTTP:ヘッダー名}` | 任意のHTTPヘッダーの値 |

### パターンの記述方法

```apache
# 正規表現マッチ
RewriteCond %{HTTP_USER_AGENT} (wget|curl|nikto) [NC]

# 否定マッチ（!をつける）
RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]

# ファイルが実在するか
RewriteCond %{REQUEST_FILENAME} -f

# ディレクトリが実在するか
RewriteCond %{REQUEST_FILENAME} -d
```

### テスト演算子（-f, -d など）

パターン部分には正規表現だけでなく、ファイルシステムの状態をチェックする**特殊なテスト演算子**が使用できる。

| 演算子 | 意味 | チェック内容 |
|---|---|---|
| `-f` | is **F**ile | 通常のファイルが存在するか |
| `-d` | is **D**irectory | ディレクトリが存在するか |
| `-s` | is file with **S**ize | ファイルが存在し、かつサイズが0でないか |
| `-l` | is symbolic **L**ink | シンボリックリンクが存在するか |
| `-F` | is existing **F**ile (via subrequest) | Apacheにサブリクエストを投げて存在確認（負荷が高い） |
| `-U` | is existing **U**RL (via subrequest) | URLとしてアクセス可能か（負荷が高い） |

> **実務で頻出するのは `-f` と `-d` の2つ。**

#### WordPressでの使用例

```apache
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
```

この記述は「リクエストされたパスに実際のファイルまたはディレクトリが存在する場合、URLの書き換えをせずそのまま返す」という意味。

画像・CSS・JSなどの実ファイルをWordPressのリライトエンジン（`index.php`）を経由させず直接配信するために必要な処理。この条件がないと `/wp-content/uploads/photo.jpg` のような実在ファイルへのアクセスもすべて `index.php` に転送されてしまい、画像やCSSが表示されなくなる。

### 複数条件の組み合わせ

`RewriteCond` を複数行並べるとデフォルトで **AND条件** になる。

```apache
# 条件A AND 条件B → 両方満たしたときだけRewriteRuleが発動
RewriteCond %{HTTPS} !=on [NC]
RewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
```

OR条件にしたい場合は `[OR]` フラグを使用する。

```apache
# ファイルが存在する OR ディレクトリが存在する
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
```

> **重要: `RewriteCond` は直後の `RewriteRule` にのみ適用される。**

---

## RewriteRule（書き換えルール）

実際にURLを書き換えたりリダイレクトしたりする本体。

### 構文

```apache
RewriteRule パターン 置換先 [フラグ]
```

### パターンと置換先

| 要素 | 説明 |
|---|---|
| `^(.*)$` | 任意のURLにマッチ（`()` でキャプチャ） |
| `$1` | キャプチャした内容を置換先で参照 |
| `%{HTTP_HOST}` | ホスト名（例: `example.com`） |
| `%{REQUEST_URI}` | リクエストパス |
| `-` | URLの書き換えをしない（ブロック用途） |

### 使用例

```apache
# HTTPSリダイレクト
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# URLは書き換えず403 Forbiddenを返す（ボットブロック）
RewriteRule .* - [F,L]

# 410 Goneを返す（不正なクエリ文字列対策）
RewriteRule ^ - [R=410,L]
```

---

## IfModule（モジュール存在チェック）

指定したApacheモジュールが有効な場合にのみ、中のディレクティブを実行する。

### 構文

```apache
<IfModule モジュール名>
    # モジュールが有効なときだけ実行される
</IfModule>
```

### 必要な理由

存在しないモジュールのディレクティブを記述すると **Apacheが起動エラー（500）** になる。`IfModule` で囲むことで、モジュールがない環境でも安全にスキップされる。

### 主要なモジュール

| モジュール | 役割 |
|---|---|
| `mod_rewrite.c` | URLの書き換え・リダイレクト |
| `mod_deflate.c` | Gzip圧縮 |
| `mod_expires.c` | ブラウザキャッシュの有効期限設定 |
| `mod_headers.c` | HTTPヘッダーの追加・変更 |
| `mod_authz_core.c` | アクセス制御（Apache 2.4+） |
| `mime_module` | MIMEタイプの追加 |

### 否定（Apache 2.2 / 2.4 互換パターン）

```apache
<IfModule mod_authz_core.c>
    # Apache 2.4+ の書き方
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    # Apache 2.2 以前の書き方（フォールバック）
    Order deny,allow
    Deny from all
</IfModule>
```

> **補足:** XServerはApache 2.4系のため、実質的には `mod_authz_core.c` 側のみ使用される。

---

## モジュールの有効化スイッチ

一部のモジュールは `IfModule` で囲むだけでなく、機能を有効化する**スイッチ（ディレクティブ）**が必要になる。スイッチがないと、その後に書いた設定がすべて無視される。

### スイッチが必要なモジュール

| モジュール | スイッチ | 役割 |
|---|---|---|
| `mod_rewrite.c` | `RewriteEngine On` | URL書き換え機能を有効化 |
| `mod_expires.c` | `ExpiresActive On` | キャッシュ有効期限機能を有効化 |

```apache
# mod_rewrite の場合
<IfModule mod_rewrite.c>
    RewriteEngine On        ← スイッチON
    RewriteCond %{HTTPS} !=on [NC]
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</IfModule>

# mod_expires の場合
<IfModule mod_expires.c>
    ExpiresActive On        ← スイッチON
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

### スイッチが不要なモジュール

`mod_deflate`、`mod_headers` などはスイッチ不要で、`IfModule` の中にいきなり設定を記述できる。すべてのモジュールにスイッチがあるわけではなく、モジュールごとの仕様による。

### 基本パターン

```
IfModule でモジュールの存在確認 → スイッチON → 設定記述
```

この3ステップがセットになっているのが `.htaccess` のお決まりの構文。

> **補足:** `RewriteEngine Off` のように明示的に無効化することも可能。デバッグ時にリライトルールを一括で停止したい場合に使える。

> **補足:** `<IfModule mod_rewrite.c>` ブロックが複数ある場合は、各ブロックでそれぞれ `RewriteEngine On` を記述する。ブロックごとに独立しているため、改めてONにする必要がある。

---

## RewriteCondのフラグ

| フラグ | 名称 | 説明 |
|---|---|---|
| `[NC]` | No Case | 大文字小文字を区別しない |
| `[OR]` | OR条件 | デフォルトのAND条件をORに変更する |

---

## RewriteRuleのフラグ

### 使用頻度の高いフラグ

| フラグ | 名称 | 説明 |
|---|---|---|
| `[L]` | Last | このルールで処理を終了し、以降のルールを評価しない |
| `[R=コード]` | Redirect | 指定したHTTPステータスコードでリダイレクト（例: `R=301`, `R=410`） |
| `[F]` | Forbidden | 403 Forbiddenを返す |
| `[NE]` | No Escape | 置換先URLをエンコードしない（二重エンコード防止） |
| `[T=型]` | Type | MIMEタイプを強制指定する（例: `T=image/webp`） |

### その他のフラグ

| フラグ | 名称 | 説明 |
|---|---|---|
| `[QSA]` | Query String Append | リダイレクト先に元のクエリ文字列を引き継ぐ |
| `[QSD]` | Query String Discard | クエリ文字列を破棄する |
| `[P]` | Proxy | リダイレクトではなくプロキシとして転送 |
| `[G]` | Gone | 410 Goneを返す（`[R=410]` のショートハンド） |
| `[CO]` | Cookie | Cookieをセットする |
| `[E]` | Environment | 環境変数をセットする |

### フラグの組み合わせ

フラグはカンマ区切りで複数指定できる。

```apache
# 301リダイレクト + 処理終了 + エンコードしない
RewriteRule ^ %{REQUEST_URI} [R=301,L,NE]
```

> **`[L]` は基本的にほぼ毎回付ける。** 付け忘れると後続ルールが意図せず適用される原因になる。

---

## 3つのディレクティブの関係性

```
IfModule      → 「このモジュールは使える？」
 └ RewriteCond  → 「この条件に合致する？」
   └ RewriteRule  → 「条件を満たしたのでこう処理する」
```

---

## 参考: HTTPステータスコード（.htaccessで使用するもの）

| コード | 意味 | 用途 |
|---|---|---|
| 301 | Moved Permanently | 恒久的なリダイレクト（HTTPS強制、URL正規化） |
| 302 | Found | 一時的なリダイレクト |
| 403 | Forbidden | アクセス拒否（ボットブロック、ファイル保護） |
| 410 | Gone | リソースが完全に削除済み（不正リクエスト対策） |