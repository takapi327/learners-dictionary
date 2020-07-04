# Angular

## 目次
- [フォーム開発]()
  - [モデル駆動型フォーム]()
    - [ReactiveFormsModule]()
    - [FormControlオブジェクト]()
    - [FormGroupオブジェクト]()
  - [フォームの状態検知]()
  - [ラジオボタン]()
  - [チェックボックス]()
  - [選択ボックス]()
  - [文字数カウント]()
  - [ファイルのアップロード]()
- [参考文献]()

## フォーム開発
### モデル駆動型フォーム
モデル駆動型フォームは、[テンプレート駆動型フォーム](https://angular.jp/guide/forms#%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E9%A7%86%E5%8B%95%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0)
と違い、検証違いコードが冗長になってしまいます。<br>
テンプレート駆動型フォームでは、検証ルールをテンプレート側で記述していましたがモデル駆動型フォームではコンポーネント側で検証ルールを記述していきます。検証ルールとフォームの実装を分けることで、テンプレート駆動型フォームよりも柔軟で複雑な要件、検証を行っていけます。
### [ReactiveFormsModule](https://angular.jp/guide/reactive-forms#%E3%83%AA%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0)
>リアクティブフォームは明示的でイミュータブルなアプローチを用い、特定の時点におけるフォームの状態を管理します。フォームの状態への変更の度に、変更間でのモデルの整合性を維持する新しい状態を返します。リアクティブフォームはObservableストリームを中心に構築されており、フォーム入力や値は入力値のストリームとして提供され、同期的にアクセスができます。
またリアクティブフォームでは、リクエストのデータには一貫性があり予測性が保証されているので、テストが簡単に行えます。すべてのストリームの利用者は、データに安全にアクセスし操作することができます。
モデル駆動型フォームを使用する場合には、ReactiveFormsModuleをインポートする必要があります。
```js
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule],
  declartions: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
上記のように`app.module.ts`内でReactiveFormsModuleをインポートし、NgModule内でも使用できるようにインポートないに追加してあげます。これでモデル駆動型フォームを実装する準備が整いました。
下記は今回使用するフォームのテンプレートです。

```html
<form [formGroup]="myForm" (ngSubmit)="show()" class="form-field">
  <div class="form-field__name">
    <label for="name">名前</label>
    <input id="name" name="name" type="text" [formControl]="name" />
    <span *ngIf="name.errors?.required">
      名前は必須項目です
    </span>
    <span *ngIf="name.errors?.minlength">
      名前は3文字以上で入力してください
    </span>
    <span *ngIf="name.errors?.maxlength">
      名前は10文字以内で入力してください
    </span>
  </div>

  <div class="form-field__mail">
    <label for="mail">メールアドレス</label>
    <input id="mail" name="mail" type="email" [formControl]="mail" />
    <span *ngIf="mail.errors?.required">
      名前は必須項目です
    </span>
    <span *ngIf="mail.errors?.email">
      メールアドレスは正しい形式で入力してください
    </span>
  </div>

  <div class="form-field__pass">
    <label for="pass">パスワード</label>
    <input id="pass" name="pass" type="password" [formControl]="pass" />
    <span *ngIf="pass.errors?.required">
      パスワードは必須項目です
    </span>
    <span *ngIf="mail.errors?.minlength">
      パスワードは8文字以上入力してください
    </span>
  </div>

  <div class="form-field__submit">
    <input type="submit" value="登録" [disabled]="myForm.invalid" />
  </div>
</form>
```
#### FormControlオブジェクト
FormControlオブジェクトとは、フォーム上の個々の入力要素を管理するためのものです。入力要素の初期値、検証ルールをコンポーネント内で設定していきます。
上記テンプレートの名前入力を見てみます。<br>
```html
  <div class="form-field__name">
    <label for="name">名前</label>
    <input id="name" name="name" type="text" [formControl]="name" />
    <span *ngIf="name.errors?.required">
      名前は必須項目です
    </span>
    <span *ngIf="name.errors?.minlength">
      名前は3文字以上で入力してください
    </span>
    <span *ngIf="name.errors?.maxlength">
      名前は10文字以内で入力してください
    </span>
  </div>
```
フォームのinputに`[formControl]="name"`と設定しています。これでコンポーネントで設定したnameという名前のformControlで検証が行えるようになりました。<br>
コンポーネント内で検証ルールなどを下記のように設定します。
```js
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(10)
  ]);
```
newでFormControlを生成し、Validatorsというバリデーションを使い空の判定、文字数の判定を設定しています。
Validatorsクラス
|メンバー|検証|
|---|---|
|required|入力値がからでないか|
|minLength|文字数が指定した値以上か|
|maxlength|文字数が指定した値以内か|
|min|数値が指定した値以上か|
|max|数値が指定した値以内か|
|pattern|正規表現|
|email|正しいメールアドレスか|

#### FormGroupオブジェクト
## 参考文献
