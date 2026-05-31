// Global variable to hold the audio hint element (the small text below volume bar)
let audioHintElement = null;
let audioPlayedSuccessfully = localStorage.getItem('audio_permitted') === 'true';

// スマホ（768px以下）向けのUI調整用スタイルを動的に注入
const injectResponsiveStyles = () => {
  const style = document.createElement('style');
  style.id = 'responsive-styles';
  style.textContent = `
    #audio-play-hint {
      position: fixed;
      z-index: 1001;
      background: #2980b9;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: all 0.2s;
      display: none;
    }
    #audio-play-hint:hover { background: #3498db; transform: scale(1.05); }

    /* ログインドロップダウン用スタイル */
    #login-dropdown { 
      display: none; position: absolute; right: 20px; top: 45px; 
      background: #222; border: 1px solid #444; border-radius: 8px; 
      box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 1100; min-width: 140px; 
      overflow: hidden; 
    }
    #login-dropdown.show { display: block !important; }
    #login-dropdown .menu-item { 
      padding: 12px 16px; color: #eee; font-size: 0.85rem; 
      cursor: pointer; text-align: left; transition: background 0.2s;
    }
    #login-dropdown .menu-item:hover { background: #333; }
    #login-dropdown .menu-item.danger { color: #ff6b6b; border-top: 1px solid #333; }

    /* 読書画面用いいねボタン */
    .reader-like-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.8rem;
      color: #555;
      transition: transform 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    }
    .reader-like-btn.liked { color: #ff4757; }
    .reader-like-btn:hover { transform: scale(1.1); }
    .header-like-container { display: none; }

    /* PCでのフッター配置用 */
    .reader-footer { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 40px; }

    /* いいねボタンのスタイル */
    .like-container {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: auto;
      color: #888;
      font-size: 0.9rem;
    }
    .like-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #555;
      transition: transform 0.2s, color 0.2s;
      padding: 4px;
      display: flex;
      align-items: center;
    }
    .like-btn.liked { color: #ff4757; transform: scale(1.2); }
    .like-btn:hover { transform: scale(1.1); }

    header nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative; /* メニューの基準点 */
    }
    #login-btn {
      margin-right: 20px;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.05) !important; /* 控えめな半透明背景 */
      border: 1px solid rgba(255, 255, 255, 0.3) !important; /* 繊細な枠線 */
      color: #a5d6a7 !important; /* 文字を薄い緑に変更 */
      padding: 6px 16px !important;
      border-radius: 20px !important;
      font-size: 0.85rem !important;
      box-shadow: none !important;
      transition: all 0.3s ease;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    #login-btn:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
      color: #fff !important;
    }

    .story-card { position: relative !important; }
    .story-menu { position: absolute; top: 12px; right: 12px; }
    .menu-btn { 
      background: none; border: none; color: #888; font-size: 1.4rem; 
      cursor: pointer; padding: 0 8px; line-height: 1; transition: color 0.2s; 
    }
    .menu-btn:hover { color: #fff; }
    .menu-dropdown { 
      display: none; position: absolute; right: 0; top: 30px; 
      background: #222; border: 1px solid #444; border-radius: 8px; 
      box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 100; min-width: 120px; 
      overflow: hidden; 
    }
    .menu-dropdown.show { display: block; }
    .menu-item { 
      padding: 12px 16px; color: #eee; font-size: 0.85rem; 
      cursor: pointer; text-align: left; transition: background 0.2s;
    }
    .menu-item:hover { background: #333; }
    .menu-item.danger { color: #ff6b6b; border-top: 1px solid #333; }

    @media screen and (max-width: 768px) {
      /* 全ページのロゴサイズを統一 */
      .logo, .logo a { 
        font-size: 24px !important; 
        font-weight: bold !important; 
        text-align: left !important; 
        margin: 10px 0 10px 15px !important; 
        display: block !important;
        text-decoration: none !important;
      }
      
      header nav {
        flex-direction: column !important;
        align-items: flex-end !important;
        padding: 5px 0 !important;
      }
      .logo { align-self: flex-start !important; }

      #login-btn {
        margin: 0 15px 10px auto !important;
        padding: 5px 12px !important; /* モバイルでは少しコンパクトに */
      }
      
      #login-dropdown { right: 15px; top: 40px; }

      .container { width: 100% !important; padding: 0 !important; margin: 0 !important; box-sizing: border-box !important; min-height: 100vh !important; }
      header { padding: 0 !important; }
      .section-title { font-size: 1.4rem !important; margin: 5px 0 10px 0 !important; }
      
      /* 作品一覧：カード幅を370pxで中央寄せ */
      .library-section { width: 100% !important; padding: 0 !important; }
      .story-grid { 
        display: flex !important; 
        flex-direction: column !important; 
        align-items: center !important; 
        padding: 5px 0 !important; 
        gap: 8px !important; 
        width: 100% !important;
      }
      .story-card { 
        width: 370px !important; 
        max-width: 90% !important; 
        margin: 0 auto !important; 
        padding: 12px 20px !important; 
        border-radius: 20px !important; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; 
        border: 1px solid rgba(255,255,255,0.1) !important; 
        box-sizing: border-box !important;
      }
      .story-card h3 { font-size: 1.2rem !important; margin-bottom: 2px !important; }
      .story-author { font-size: 0.85rem !important; margin-bottom: 4px !important; color: #bbb !important; }
      .story-desc { font-size: 0.85rem !important; line-height: 1.3 !important; margin-bottom: 8px !important; }
      .card-buttons { flex-direction: row !important; gap: 10px !important; display: flex !important; width: 100% !important; }
      .card-buttons .btn { flex: 1 !important; width: auto !important; padding: 8px !important; font-size: 0.9rem !important; border-radius: 10px !important; }

      /* 読書画面の調整 */
      .reader-section { padding: 30px 15px !important; }
      .reader-content { padding: 25px 20px !important; border-radius: 15px !important; min-height: 400px !important; }
      .story-title { font-size: 1.8rem !important; margin-top: 10px !important; line-height: 1.3 !important; }
      .story-author-name { font-size: 1rem !important; margin-bottom: 15px !important; }
      .text-body p { font-size: 1.15rem !important; line-height: 1.9 !important; margin-bottom: 1.5rem !important; }
      .reader-footer { display: flex !important; flex-direction: column-reverse !important; gap: 15px !important; align-items: stretch !important; margin-top: 40px !important; padding-bottom: 120px !important; }
      .header-like-container { display: flex !important; margin: 0 20px 10px auto !important; }
      #mobile-next-btn { display: block !important; position: fixed !important; bottom: 20px !important; left: 5% !important; width: 90% !important; margin: 0 !important; padding: 12px !important; font-size: 1rem !important; border-radius: 12px !important; box-shadow: 0 8px 30px rgba(0,0,0,0.6) !important; z-index: 1000 !important; background: #2980b9 !important; border: none !important; color: white !important; font-weight: bold !important; text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important; }
      #back-to-library { text-align: center; padding: 12px !important; background: rgba(255,255,255,0.05); border-radius: 10px; display: none !important; } /* 初期非表示 */
      .volume-control { width: 160px !important; margin: 5px 0 15px auto !important; padding: 8px 12px !important; background: rgba(255, 255, 255, 0.1); border-radius: 20px; justify-content: space-between !important; }
      #audio-play-hint { bottom: 100px !important; right: 20px !important; top: auto !important; left: auto !important; font-size: 14px !important; padding: 12px 20px !important; }
      .sound-marker { width: 40px !important; }
      .sound-card { padding: 15px !important; font-size: 1rem !important; margin-bottom: 10px !important; }

      /* 執筆画面（write.html）の調整 */
      .editor-container { flex-direction: column !important; gap: 20px !important; padding: 0 10px !important; }
      .editor-main { order: 1 !important; width: 100% !important; }
      .editor-sidebar { order: 2 !important; width: 100% !important; position: static !important; gap: 30px !important; padding-bottom: 60px !important; }
      .input-row { flex-direction: column !important; gap: 0 !important; }
      .editor-body-container { height: 350px !important; }
      #sound-indicator-bar { height: 350px !important; }
      .editor-main input, .editor-main textarea { font-size: 16px !important; padding: 12px 15px !important; border-radius: 20px !important; margin-bottom: 10px !important; }
      #editor-display { font-size: 16px !important; padding: 12px 15px !important; }
      .sidebar-group { gap: 10px !important; }
      .sidebar-group h3 { font-size: 1.1rem !important; margin-bottom: 5px !important; }

      /* 音響ライブラリ（BGM・SE.html）の調整 */
      .field-theme h1 { font-size: 1.8rem !important; margin-top: 10px !important; margin-bottom: 5px !important; }
      .sound-section { padding: 15px !important; margin-top: 20px !important; border-radius: 15px !important; }
      .category-title { font-size: 1.1rem !important; margin-bottom: 10px !important; padding-left: 10px !important; }
      .sound-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
      .sound-card { min-height: 70px !important; padding: 10px !important; font-size: 0.9rem !important; border-radius: 12px !important; }
    }
  `;
  document.head.appendChild(style);
};

// Function to create and append the audio hint
const createAudioHint = () => {
  if (audioHintElement) return; // Already created

  audioHintElement = document.createElement('button');
  audioHintElement.id = 'audio-play-hint'; // New ID for styling
  audioHintElement.textContent = 'クリックで音楽を再生'; // The desired text
  audioHintElement.style.display = 'none'; // Initially hidden

  // ボタン自体のクリックでも再生を開始するようにする
  audioHintElement.addEventListener('click', startHomeBgm);

  document.body.appendChild(audioHintElement);

  updateAudioHintPosition();
};

const updateAudioHintPosition = () => {
  if (!audioHintElement || window.innerWidth <= 768) return;

  // Position the hint dynamically below the volume control
  const volumeControl = document.querySelector('.volume-control');
  if (volumeControl) {
    // Use getBoundingClientRect for accurate position relative to viewport
    const rect = volumeControl.getBoundingClientRect();
    audioHintElement.style.top = `${rect.bottom + 5}px`; // 5px margin below volume control
    // Align right edge of the hint with the right edge of the volume control
    audioHintElement.style.right = `${window.innerWidth - rect.right}px`;
  }
};

const showAudioHint = () => {
  if (!audioHintElement) {
    createAudioHint();
  }
  audioHintElement.style.display = 'block';
};

const hideAudioHint = () => {
  if (audioHintElement) {
    audioHintElement.style.display = 'none';
  }
};

// BGMの再生
const startHomeBgm = () => {
  const homeAudio = document.getElementById('audio-home');
  if (!homeAudio) {
    hideAudioHint(); // If no audio element, no hint needed
    return;
  }

    // 閲覧ページ（プレビュー中を除く）ではホームBGMを再生しない
    // editor-containerがある場合は作品作成画面なので、プレビューエリアがあっても再生を続ける
    if (document.querySelector('.reader-section') && !document.querySelector('.editor-container')) {
        hideAudioHint();
        return;
    }

    // 既に再生中なら何もしない
    if (!homeAudio.paused) return;

    const savedVolume = parseFloat(localStorage.getItem('globalVolume') || 0.4);
    homeAudio.volume = savedVolume;

    // 前のページから引き継いだ再生時間をセット
    const savedTime = localStorage.getItem('bgm_time');
    if (savedTime && !homeAudio.dataset.timeSet) {
        const setTime = () => {
            homeAudio.currentTime = parseFloat(savedTime);
            homeAudio.dataset.timeSet = "true";
        };
        if (homeAudio.readyState >= 1) {
            setTime();
        } else {
            homeAudio.addEventListener('loadedmetadata', setTime, { once: true });
        }
    }

    homeAudio.play()
        .then(() => {
            audioPlayedSuccessfully = true;
            localStorage.setItem('audio_permitted', 'true');
            hideAudioHint();
            window.removeEventListener('click', startHomeBgm);
            window.removeEventListener('keydown', startHomeBgm);
        })
        .catch(e => {
            console.log("BGM playback failed:", e);
            showAudioHint();
        });
};

// ページ読み込み時に自動再生を試みる
window.addEventListener('DOMContentLoaded', () => {
  createAudioHint(); // Create the hint element once on DOMContentLoaded
  startHomeBgm();
});

// 最初のページロード時に、ユーザー操作を待ってBGM再生を試みる
// これらのリスナーは、BGMが一度でも成功するまで残る
window.addEventListener('click', startHomeBgm);
window.addEventListener('keydown', startHomeBgm);
window.addEventListener('resize', updateAudioHintPosition);

// 遷移時に現在の再生時間を保存する関数
const saveBgmTime = () => {
  const homeAudio = document.getElementById('audio-home');
  // 再生中、または自動再生待ちの状態であれば時間を保存する
  if (homeAudio && (homeAudio.currentTime > 0 || localStorage.getItem('bgm_time'))) {
    localStorage.setItem('bgm_time', homeAudio.currentTime);
  }
};

// SE再生関数を追加
const playPageTurn = () => {
  const mekuru = document.getElementById('audio-mekuru');
  if (mekuru) {
    const savedVolume = parseFloat(localStorage.getItem('globalVolume') || 0.4);
    mekuru.volume = savedVolume;
    mekuru.play().catch(e => console.log("SE playback failed:", e));
  }
};

// firebase.js からも呼べるようにグローバルに公開
window.saveBgmTime = saveBgmTime;
window.playPageTurn = playPageTurn;

const readBtn = document.getElementById('read-btn');
if (readBtn) {
  readBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'novels.html';
    }, 700);
  });
}

const writeBtn = document.getElementById('write-btn');
if (writeBtn) {
  writeBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    localStorage.removeItem('edit_story_id'); // 新規作成時は編集IDを消去
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'write.html';
    }, 700);
  });
}

// エディタ画面から音響一覧へ移動
const soundLibraryBtn = document.getElementById('open-sound-library');
if (soundLibraryBtn) {
  soundLibraryBtn.addEventListener('click', () => {
    // 移動前に自動で下書き保存を実行（draftBtnと同じ処理）
    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.getElementById('editor-body');

    const draft = {
      title: titleInput ? titleInput.value : '',
      author: authorInput ? authorInput.value : '',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput ? contentInput.value : ''
    };
    localStorage.setItem('draft_story', JSON.stringify(draft));

    const container = document.querySelector('.container');
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      // ルートの BGM・SE.html へ遷移
      location.href = 'BGM・SE.html';
    }, 700);
  });
}

// 音響一覧からエディタ画面へ戻る
document.querySelectorAll('#back-to-editor, #back-to-editor-top').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      // ルートの write.html へ戻る
      location.href = 'write.html';
    }, 700);
  });
});

// 作品一覧にある全ての「読む」ボタンにカメラ移動演出を適用
document.querySelectorAll('.story-card .btn.primary').forEach(btn => {
  btn.addEventListener('click', () => {
    // 静的な作品（終電の後など）を読む場合は、動的IDをクリアする
    localStorage.removeItem('current_story_id');
    
    saveBgmTime();
    const container = document.querySelector('.container');
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    setTimeout(() => {
      // 全てルートの read.html を参照
      location.href = 'read.html';
    }, 700);
  });
});

// --- 投稿機能の実装 ---
const publishBtn = document.getElementById('publish-btn');
if (publishBtn) {
  publishBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Firebaseの準備ができているか確認（読み込み待ち対策）
    if (!window.db || !window.auth) {
      alert('通信の準備中です。数秒待ってから再度お試しください。');
      return;
    }

    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.getElementById('editor-body');

    if (!contentInput.value.trim()) {
      alert('本文を入力してください。');
      return;
    }

    // ゲスト投稿時の編集コード取得
    let deleteKey = null;
    let editId = localStorage.getItem('edit_story_id');
    // 文字列の "null" や "undefined" が入っている場合を考慮
    if (editId === "null" || editId === "undefined") editId = null;

    if (!editId && (!window.auth || !window.auth.currentUser)) {
      deleteKey = prompt("この投稿を後で編集・削除するための「編集コード」を設定してください（任意・英数字推奨）");
      // キャンセルされた場合は中断
      if (deleteKey === null) return;
    }

    const newStory = {
      id: editId,
      title: titleInput.value.trim() || '無題の物語',
      author: authorInput.value.trim() || '名無しさん',
      // 作品一覧の著作者名の下に表示する文として「前置き」を使用
      desc: prefaceInput ? prefaceInput.value.trim() : '',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput.value,
    };

    if (deleteKey) newStory.deleteKey = deleteKey; // ゲスト用の削除キー

    // Firebase保存用のカスタムイベントを発火
    const firebaseEvent = new CustomEvent('publishStory', { detail: newStory });
    window.dispatchEvent(firebaseEvent);

    // ローカルストレージへの保存とページ遷移はfirebase.js側でFirebase保存完了後に実行される
    // ここではFirebaseへのイベント発火のみを行う
    // ローカルストレージへの保存はFirebaseへの保存が成功した場合のみ行うべきなので、firebase.jsに移動
    // playPageTurn(); // ページめくり音は遷移時に鳴らすため、firebase.js側で実行
  });
}

// --- 下書き保存機能の実装 ---
const draftBtn = document.getElementById('draft-btn');
if (draftBtn) {
  draftBtn.addEventListener('click', () => {
    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.getElementById('editor-body');

    const draft = {
      title: titleInput ? titleInput.value : '',
      author: authorInput ? authorInput.value : '',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput ? contentInput.value : ''
    };
    localStorage.setItem('draft_story', JSON.stringify(draft));
    alert('下書きを保存しました。');
  });

  // 執筆画面であればページ読み込み時に下書きを復元
  const titleInput = document.getElementById('editor-title');
  if (titleInput) {
    const editId = localStorage.getItem('edit_story_id');
    if (editId && editId !== "undefined") {
      // 編集モード：Firestoreから最新データを取得
      (async () => {
        try {
          const docRef = window.doc(window.db, 'stories', editId);
          const docSnap = await window.getDoc(docRef);
          if (docSnap.exists()) {
            const story = docSnap.data();
            titleInput.value = story.title || '';
            const authorInput = document.getElementById('editor-author');
            if (authorInput) authorInput.value = story.author || '';
            const prefaceInput = document.getElementById('editor-preface');
            if (prefaceInput) prefaceInput.value = story.preface || '';
            const contentInput = document.getElementById('editor-body');
            if (contentInput) contentInput.value = story.content || '';
            setTimeout(updateSoundIndicator, 0); // 描画後に実行
          }
        } catch (e) {
          console.error("作品の読み込みに失敗しました:", e);
        }
      })();
    } else {
      // 通常の下書き復元
    const savedDraft = localStorage.getItem('draft_story');
    if (savedDraft && savedDraft !== "undefined") {
      try {
        const draft = JSON.parse(savedDraft);
        titleInput.value = draft.title || '';
        const authorInput = document.getElementById('editor-author');
        if (authorInput) authorInput.value = draft.author || '';
        const prefaceInput = document.getElementById('editor-preface');
        if (prefaceInput) prefaceInput.value = draft.preface || '';
        const contentInput = document.getElementById('editor-body');
        if (contentInput) contentInput.value = draft.content || '';
        setTimeout(updateSoundIndicator, 0); // 描画後に実行
      } catch (e) {
        console.error("下書きの復元に失敗しました。データが壊れている可能性があります:", e);
      }
    }
    }
  }
}

// --- 作品一覧の動的表示 ---
const libraryGrid = document.querySelector('.library-section .story-grid');
if (libraryGrid) {
  const loadStories = async (user) => {
    libraryGrid.innerHTML = ''; // リストをクリアして再描画
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isMyStories = urlParams.get('filter') === 'mine';
      
      let q;
      if (isMyStories) {
        const titleEl = document.querySelector('.section-title');
        if (titleEl) titleEl.textContent = '自分の作品一覧';

        if (user) {
          // 「自分の作品一覧」表示時：UIDで絞り込み
          q = window.query(
            window.collection(window.db, 'stories'), 
            window.where('uid', '==', user.uid),
            window.orderBy('createdAt', 'desc')
          );
        } else {
          // ログインしていない場合
          libraryGrid.innerHTML = '<p style="text-align:center; padding: 40px; color: #bbb;">自分の作品を表示するには、Googleでログインしてください。</p>';
          return;
        }
      } else {
        q = window.query(window.collection(window.db, 'stories'), window.orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await window.getDocs(q);
      
      if (querySnapshot.empty && !isMyStories) {
        libraryGrid.innerHTML = '<p style="text-align:center; padding: 40px; color: #bbb;">まだ公開された作品がありません。</p>';
        return;
      }
      
      if (querySnapshot.empty && isMyStories) {
        libraryGrid.innerHTML = '<p style="text-align:center; padding: 40px; color: #bbb;">まだ投稿した作品がありません。</p>';
        return;
      }
      
      const adminEmail = "soundnovelnira@gmail.com"; // あなたのGmailアドレスをここに設定

      querySnapshot.forEach((doc) => {
        const story = doc.data();
        const storyId = doc.id;

        // 権限チェック: 投稿者本人、管理者、またはゲスト投稿(誰でもコードで編集・削除を試みれる)
        const isOwner = user && story.uid === user.uid;
        const isAdmin = user && user.email === adminEmail;
        const isGuestStory = story.uid === "guest";

        // いいね状態の判定
        const likedBy = story.likedBy || [];
        const likeCount = likedBy.length;
        const isLiked = user && likedBy.includes(user.uid);

        const card = document.createElement('div');
        card.className = 'story-card';
        
        let descText = (story.preface && story.preface.trim() !== "") ? story.preface : "";
        let cleanDesc = descText.replace(/\[(BGM|SE|BG):.+?\]/g, '').replace(/\n/g, ' ');
        if (cleanDesc.length > 80) cleanDesc = cleanDesc.substring(0, 80) + '...';

        const canShowMenu = isOwner || isAdmin || isGuestStory;
        const menuHtml = canShowMenu ? `
          <div class="story-menu">
            <button class="menu-btn">···</button>
            <div class="menu-dropdown">
              <div class="menu-item edit-story-btn" data-id="${storyId}">編集する</div>
              <div class="menu-item danger delete-story-btn" data-id="${storyId}">削除する</div>
            </div>
          </div>
        ` : '';

        card.innerHTML = `
          ${menuHtml}
          <h3>${story.title}</h3>
          <p class="story-author">by ${story.author}</p>
          <p class="story-desc">${cleanDesc}</p>
          <div class="card-buttons">
            <div class="like-container">
              <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${storyId}">
                ${isLiked ? '❤️' : '♡'}
              </button>
              <span class="like-count">${likeCount}</span>
            </div>
            <button class="btn primary user-story-btn" data-id="${storyId}">読む</button>
          </div>
        `;
        libraryGrid.appendChild(card);
      });
    } catch (e) {
      console.error("作品の取得に失敗しました:", e);
      libraryGrid.innerHTML = '<p style="text-align:center; padding: 40px; color: #ff6b6b;">作品の取得に失敗しました。ブラウザのコンソール（F12キー）を確認して、Firebaseのインデックス作成が必要な場合は表示されたURLをクリックしてください。</p>';
    }
  };

  // ログイン状態の変化を監視し、変化があるたびに一覧を再読み込みする
  const initLibraryAuth = () => {
    // Firebaseの準備ができるまで待機
    if (!window.auth || !window.onAuthStateChanged) {
      setTimeout(initLibraryAuth, 50);
      return;
    }

    window.onAuthStateChanged(window.auth, (user) => {
      loadStories(user);
    });
  };

  initLibraryAuth();

  // 動的に生成されたボタンへのクリックイベント（委譲）
  libraryGrid.addEventListener('click', async (e) => {
    // メニューボタンのトグル
    if (e.target.classList.contains('menu-btn')) {
      const dropdown = e.target.nextElementSibling;
      document.querySelectorAll('.menu-dropdown.show').forEach(el => {
        if (el !== dropdown) el.classList.remove('show');
      });
      dropdown.classList.toggle('show');
      e.stopPropagation();
      return;
    }

    // いいねボタンの処理
    if (e.target.closest('.like-btn')) {
      const btn = e.target.closest('.like-btn');
      const storyId = btn.dataset.id;
      const user = window.auth.currentUser;

      if (!user) {
        alert('いいねするにはログインが必要です');
        return;
      }

      const docRef = window.doc(window.db, 'stories', storyId);
      const isLiked = btn.classList.contains('liked');
      const countEl = btn.nextElementSibling;
      let currentCount = parseInt(countEl.textContent);

      try {
        if (isLiked) {
          // いいね解除
          await window.updateDoc(docRef, { likedBy: window.arrayRemove(user.uid) });
          btn.classList.remove('liked');
          btn.textContent = '♡';
          countEl.textContent = currentCount - 1;
        } else {
          // いいね登録
          await window.updateDoc(docRef, { likedBy: window.arrayUnion(user.uid) });
          btn.classList.add('liked');
          btn.textContent = '❤️';
          countEl.textContent = currentCount + 1;
        }
      } catch (err) {
        console.error("いいね更新失敗:", err);
      }
      return;
    }

    if (e.target.classList.contains('user-story-btn')) {
      const storyId = e.target.dataset.id;
      localStorage.setItem('current_story_id', storyId);
      
      const container = document.querySelector('.container');
      if (container) container.classList.add('camera-down-leave');
      
      saveBgmTime();
      playPageTurn();
      
      setTimeout(() => {
        location.href = 'read.html';
      }, 700);
    }

    if (e.target.classList.contains('edit-story-btn')) {
      const storyId = e.target.dataset.id;
      
      try {
        const docRef = window.doc(window.db, 'stories', storyId);
        const docSnap = await window.getDoc(docRef);
        if (!docSnap.exists()) return;
        const story = docSnap.data();

        const user = window.auth.currentUser;
        const adminEmail = "soundnovelnira@gmail.com";
        const isOwner = user && story.uid === user.uid;
        const isAdmin = user && user.email === adminEmail;

        // 編集権限の確認
        if (!isOwner && !isAdmin) {
          if (story.uid === 'guest') {
            const code = prompt("編集するために編集コードを入力してください");
            if (code === null) return;
            if (story.deleteKey && code !== story.deleteKey) {
              alert("コードが一致しません");
              return;
            } else if (!story.deleteKey) {
              alert("この投稿は編集コードが設定されていないため、管理者のみ編集可能です。");
              return;
            }
          } else {
            alert("編集権限がありません");
            return;
          }
        }

        // 権限確認完了、編集画面へ
        localStorage.setItem('edit_story_id', storyId);
        const container = document.querySelector('.container');
        if (container) container.classList.add('camera-down-leave');
        saveBgmTime();
        playPageTurn();
        setTimeout(() => {
          location.href = 'write.html';
        }, 700);
      } catch (err) {
        console.error(err);
        alert("読み込みに失敗しました");
      }
    }

    if (e.target.classList.contains('delete-story-btn')) {
      const storyId = e.target.dataset.id;
      
      try {
        const docRef = window.doc(window.db, 'stories', storyId);
        const docSnap = await window.getDoc(docRef);
        if (!docSnap.exists()) return;
        const story = docSnap.data();

        const user = window.auth.currentUser;
        const adminEmail = "soundnovelnira@gmail.com";
        const isOwner = user && story.uid === user.uid;
        const isAdmin = user && user.email === adminEmail;

        // 削除権限の確認
        if (!isOwner && !isAdmin) {
          if (story.uid === 'guest') {
            const code = prompt("編集コードを入力してください");
            if (code === null) return;
            if (story.deleteKey && code !== story.deleteKey) {
              alert("編集コードが一致しません");
              return;
            } else if (!story.deleteKey) {
              alert("この投稿は編集コードが設定されていないため、管理者のみ削除可能です。");
              return;
            }
          } else {
            alert("削除権限がありません");
            return;
          }
        }

        if (confirm('この物語をFirebaseから削除してもよろしいですか？')) {
          await window.deleteDoc(docRef);
          e.target.closest('.story-card').remove();
          if (window.playPageTurn) window.playPageTurn();
        }
      } catch (err) {
        console.error(err);
        alert("削除に失敗しました");
      }
    }
  });
}

// 読書画面から一覧へ戻るボタン
const backBtn = document.getElementById('back-to-library');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    if (container) container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'novels.html';
    }, 700);
  });
}

// ロゴや「戻る」リンクにもアニメーションと保存を適用
document.querySelectorAll('.logo a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      const container = document.querySelector('.container');
      if (container) container.classList.add('camera-down-leave');
      playPageTurn();
      saveBgmTime();
      setTimeout(() => {
        location.href = href;
      }, 700);
    }
  });
});

// 音量調節のロジック
const volumeSlider = document.getElementById('volume-slider');
if (volumeSlider) {
  const savedVolume = parseFloat(localStorage.getItem('globalVolume') || 0.4);
  volumeSlider.value = savedVolume;

  volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    localStorage.setItem('globalVolume', value);
    document.querySelectorAll('audio').forEach(audio => {
      audio.volume = value;
    });
  });
}

// エディタ画面：サウンドカードのクリックで音声を再生
document.querySelectorAll('.sound-card').forEach(card => {
  card.addEventListener('click', () => {
    let audioId = card.dataset.audio;
    if (!audioId) return;

    // 「00-home」のカードが押された時は、共通の背景BGMタグ（audio-home）を操作する
    const isHome = (audioId === '00-home' || audioId === 'audio-home');
    const targetAudio = document.getElementById(isHome ? 'audio-home' : audioId);
    if (!targetAudio) return;
    
    const currentAudioId = isHome ? 'audio-home' : audioId;

    // IDをクリップボードにコピー
    navigator.clipboard.writeText(currentAudioId).then(() => {
        const originalText = card.innerHTML;
        card.innerHTML = `<span style="font-size: 0.8rem; color: #27ae60;">IDコピー & 再生中</span>`;
        card.style.borderColor = '#3498db';
        setTimeout(() => {
            card.innerHTML = originalText;
            card.style.borderColor = '';
        }, 1500);
    });

    // 現在再生中のすべての音声を停止して切り替える
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== targetAudio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const savedVolume = parseFloat(localStorage.getItem('globalVolume') || 0.4);
    targetAudio.volume = savedVolume;
    targetAudio.play().catch(e => console.log("Audio play failed:", e));
  });
});

function insertSoundTag(type) {
  const textarea = document.getElementById('editor-body');
  if (!textarea) {
    console.error("エディタが見つかりません。");
    return;
  }
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  let id;
  if (type === 'AUTO') {
    id = prompt("音響IDを入力してください（一覧でコピーしたIDを貼り付けてください）");
  } else {
    const promptMsg = type === 'BG' ? "背景の色（例: black, #333）または設定したいクラス名を入力してください。" : `${type}のIDを入力してください`;
    id = prompt(promptMsg, type === 'BG' ? 'black' : 'audio-');
  }
  if (!id) return;

  // もしタグごと貼り付けられた場合 ([BGM:xxx]など) はID部分だけ抜き出す
  const cleanId = id.replace(/\[(BGM|SE|BG):|\]/g, '').trim();
  
  const finalType = (type === 'AUTO') ? (cleanId.startsWith('10-') ? 'SE' : 'BGM') : type;
  const tag = `[${finalType}:${cleanId}]`;
  const selectedText = text.substring(start, end);

  let taggedText;
  if (selectedText.length === 0) {
    taggedText = tag;
  } else {
    // 複数行が選択されている場合、各行の先頭にタグを挿入する
    // これにより、読書画面での自動フェードアウトを防ぎ、一括で演出を設定できる
    const lines = selectedText.split('\n');
    taggedText = lines.map(line => line.trim() !== '' ? tag + line : line).join('\n');
  }

  textarea.value = text.substring(0, start) + taggedText + text.substring(end);
  
  textarea.focus();
  const newPos = start + taggedText.length;
  textarea.setSelectionRange(newPos, newPos);
  updateSoundIndicator();
}

// エディタ画面のボタン初期化
// DOMContentLoaded内で実行することで、HTMLの読み込みを確実に待ちます
document.addEventListener('DOMContentLoaded', () => {
  const addSoundBtn = document.getElementById('add-sound-btn');
  if (addSoundBtn) {
    addSoundBtn.onclick = () => {
      insertSoundTag('AUTO');
    };
  }
});

// 読書画面：一行ずつ表示する演出
const textBody = document.querySelector('.text-body');
if (textBody) {
  // いいねボタンの状態を更新する関数
  const updateReaderLikeIcons = (storyId, likedBy) => {
    const user = window.auth ? window.auth.currentUser : null;
    const isLiked = user && likedBy && likedBy.includes(user.uid);
    
    document.querySelectorAll(`.reader-like-btn[data-id="${storyId}"]`).forEach(btn => {
      btn.classList.toggle('liked', !!isLiked);
      btn.innerHTML = isLiked ? '❤️' : '♡';
    });
  };

  // いいね処理の共通関数
  const handleReaderLike = async (btn, storyId) => {
    const user = window.auth.currentUser;
    if (!user) {
      alert('いいねするにはログインが必要です');
      return;
    }
    const docRef = window.doc(window.db, 'stories', storyId);
    const isLiked = btn.classList.contains('liked');
    try {
      if (isLiked) {
        await window.updateDoc(docRef, { likedBy: window.arrayRemove(user.uid) });
      } else {
        await window.updateDoc(docRef, { likedBy: window.arrayUnion(user.uid) });
      }
      // 最新の状態を取得するために再読み込み（または手動で配列を更新して再描画）
      // ここでは簡易的に即時反映
      const docSnap = await window.getDoc(docRef);
      if (docSnap.exists()) {
        updateReaderLikeIcons(storyId, docSnap.data().likedBy || []);
      }
    } catch (err) {
      console.error("いいね更新失敗:", err);
    }
  };

  (async () => {
    // --- Firebaseから物語を読み込み ---
    // FirebaseとAuthの準備ができるまで待機
    while (!window.db || !window.auth || !window.getDoc) {
      await new Promise(r => setTimeout(r, 100));
    }

    const storyId = localStorage.getItem('current_story_id');
    if (storyId) {
      try {
        const docSnap = await window.getDoc(window.doc(window.db, 'stories', storyId));
        
        if (docSnap.exists()) {
          const story = docSnap.data();
          // タイトルと著者を書き換え
          const titleEl = document.querySelector('.story-title');
          const authorEl = document.querySelector('.story-author-name');
          if (titleEl) titleEl.textContent = story.title;
          if (authorEl) authorEl.textContent = story.author + ' 著';

          // 本文を入れ替え
          const endMarker = document.getElementById('story-end-marker');
          textBody.innerHTML = ''; 
          
          const allLines = [];
          allLines.push(...story.content.split('\n').filter(l => l.trim()));

          allLines.forEach(lineText => {
            const p = document.createElement('p');
            p.textContent = lineText;
            textBody.appendChild(p);
          });
          if (endMarker) textBody.appendChild(endMarker);
          
          // 行のリストを再取得して初期化
          lines = textBody.querySelectorAll('p');

          // --- いいねボタンの設置 ---
          // PC用（フッター: 一覧に戻るボタンの横）
          const footer = document.querySelector('.reader-footer');
          if (footer) {
            if (!footer.querySelector(`.reader-like-btn[data-id="${storyId}"]`)) {
              const footerLikeBtn = document.createElement('button');
              footerLikeBtn.className = 'reader-like-btn';
              footerLikeBtn.dataset.id = storyId;
              footerLikeBtn.onclick = () => handleReaderLike(footerLikeBtn, storyId);
              footer.appendChild(footerLikeBtn);
            }
          }

          // スマホ用（ヘッダー: ログインボタンの下）
          // header navが見つからない場合に備えて、login-btnの親要素を探す
          const loginBtn = document.getElementById('login-btn');
          const headerNav = document.querySelector('header nav') || (loginBtn ? loginBtn.parentElement : null);
          
          if (headerNav && !headerNav.querySelector('.header-like-container')) {
            const container = document.createElement('div');
            container.className = 'header-like-container';
            const headerLikeBtn = document.createElement('button');
            headerLikeBtn.className = 'reader-like-btn';
            headerLikeBtn.dataset.id = storyId;
            headerLikeBtn.onclick = () => handleReaderLike(headerLikeBtn, storyId);
            container.appendChild(headerLikeBtn);
            headerNav.appendChild(container);
          }

          // 初期表示の更新
          updateReaderLikeIcons(storyId, story.likedBy || []);

          // ログイン状態が変わった時にもハートを更新するようにする
          window.onAuthStateChanged(window.auth, () => {
            updateReaderLikeIcons(storyId, story.likedBy || []);
          });

        }
      } catch (e) {
        console.error("物語の取得に失敗しました:", e);
      }
    }
  })();

  // 行のリストを取得
  let lines = textBody.querySelectorAll('p');
  let currentLineIndex = 0;

  // フェードアウト関数
  const fadeOut = (audio, duration = 2000) => {
    const startVolume = audio.volume;
    const step = startVolume / (duration / 50);
    const timer = setInterval(() => {
      if (audio.volume > step) {
        audio.volume -= step;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(timer);
      }
    }, 50);
  };

  // フェードイン関数
  const fadeIn = (audio, targetVolume, duration = 2000) => {
    audio.volume = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
    const step = targetVolume / (duration / 50);
    const timer = setInterval(() => {
      if (audio.volume < targetVolume - step) {
        audio.volume += step;
      } else {
        audio.volume = targetVolume;
        clearInterval(timer);
      }
    }, 50);
  };

  const showNextLine = () => {
    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex];
      currentLine.classList.add('is-visible');

      // --- 音声演出の制御 ---
      const currentVolume = volumeSlider ? volumeSlider.value : 0.4;

      const tagRegex = /\[(BGM|SE|BG):(.+?)\]/g;
      // タグが含まれているかチェック
      const hasSoundEffect = tagRegex.test(currentLine.textContent);
      tagRegex.lastIndex = 0; // test後のインデックスをリセット

      // 現在の行に指定されていない音響（BGM/SE）をすべてフェードアウト
      const currentLineTags = [];
      let m;
      const audioSearchRegex = /\[(BGM|SE):(.+?)\]/g;
      while ((m = audioSearchRegex.exec(currentLine.textContent)) !== null) {
        currentLineTags.push(m[2]);
      }

      document.querySelectorAll('audio').forEach(a => {
        if (a.id !== 'audio-home' && a.id !== 'audio-mekuru' && !currentLineTags.includes(a.id)) {
          if (!a.paused && a.volume > 0) {
            fadeOut(a, 1000);
          }
        }
      });

      const originalText = currentLine.textContent;
      let match;
      
      while ((match = tagRegex.exec(originalText)) !== null) {
        const type = match[1];
        const audioId = match[2];

        if (type === 'BG') {
          // 背景変更：色の指定またはクラスの追加
          if (audioId.startsWith('#') || audioId.includes('rgb') || audioId === 'black' || audioId === 'white') {
            document.body.style.background = audioId;
          } else {
            document.body.className = audioId;
          }
          continue;
        }

        const audioEl = document.getElementById(audioId);
        if (audioEl) {
          if (type === 'BGM') {
            document.querySelectorAll('audio[loop]').forEach(a => {
              if (a.id !== audioId && a.id !== 'audio-home') {
                if (a.volume > 0) fadeOut(a, 1000);
                else { a.pause(); a.currentTime = 0; }
              }
            });
            fadeIn(audioEl, currentVolume, 1000);
          } else {
            // SEタグ、またはBGMタグだがループ設定がない（効果音）場合
            audioEl.volume = currentVolume;
            audioEl.currentTime = 0;
            audioEl.play().catch(e => console.log("Sound play failed:", e));
          }
        }
      }

      // 表示からタグを消去
      currentLine.textContent = originalText.replace(tagRegex, '');

      // タグを除去した結果、空行になった場合は自動で次へ（演出のみの行を飛ばす）
      if (currentLine.textContent.trim() === "" && currentLineIndex < lines.length - 1) {
        currentLine.style.display = 'none'; // スペースを取らないように隠す
        currentLineIndex++;
        showNextLine();
        return;
      }

      // 新しい行が画面の中央に来るように自動スクロール
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentLineIndex++;

      // 最後の行を表示し終えたら、少し待ってからENDを出す
      if (currentLineIndex === lines.length) {
        const endMarker = document.getElementById('story-end-marker');
        if (endMarker) {
          setTimeout(() => {
            endMarker.classList.add('is-visible');
            endMarker.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 物語が終わったら「次へ」ボタンを隠す
            const nextBtn = document.getElementById('mobile-next-btn');
            if (nextBtn) {
              nextBtn.style.opacity = '0';
              setTimeout(() => nextBtn.remove(), 300);
            }

            // 「一覧に戻る」ボタンを表示（ENDと同じタイミング）
            const footer = document.querySelector('.reader-footer');
            if (footer) {
              footer.style.setProperty('display', 'flex', 'important'); // PCでの親要素非表示を解除
            }
            const backToLibraryBtn = document.getElementById('back-to-library');
            if (backToLibraryBtn) {
              // スマホ用CSSの !important 指定を上書きして表示させる
              backToLibraryBtn.style.setProperty('display', 'flex', 'important');
            }
          }, 1200); // 1.2秒待ってからENDと一緒に表示
        }
      }
    }
  };

  // スマホ・PC共通の「次へ」ボタンを生成
  const createNextButton = () => {
    const footer = document.querySelector('.reader-footer');
    if (!footer) return; // フッターがないページ（一覧など）では表示しない

    const nextBtn = document.createElement('button');
    nextBtn.id = 'mobile-next-btn';
    nextBtn.textContent = '次へ';

    // スタイル設定：一覧に戻るボタンの右側、本文の右端に合わせる
    Object.assign(nextBtn.style, {
      padding: '12px 32px',
      borderRadius: '30px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
      transition: 'opacity 0.3s, transform 0.1s',
      userSelect: 'none',
      marginLeft: 'auto' // 右寄せにする
    });

    nextBtn.addEventListener('click', (e) => {
      showNextLine();
    });

    footer.appendChild(nextBtn);
  };

  createNextButton();

  // 画面クリックで次へ（ボタンやリンク以外）
  window.addEventListener('click', (e) => {
    // ボタン、リンク、音量スライダーの操作時はテキストを進めない
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.volume-control')) return;
    showNextLine();
  });

  // スペースキーで次へ
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault(); // ブラウザのデフォルトのスクロールを防止
      showNextLine();
    }
  });
}

// --- サウンドインジケーター（右側のバー）の処理 ---
function updateSoundIndicator() {
  const textarea = document.getElementById('editor-body');
  const bar = document.getElementById('sound-indicator-bar');
  const display = document.getElementById('editor-display');
  if (!textarea || !bar || !display) return;

  // バー（縦棒）の長さをテキストエリアの枠の高さに合わせる
  bar.style.height = textarea.offsetHeight + 'px';
  bar.style.left = '0'; // バーを本文の枠の左端に配置
  bar.style.right = 'auto'; // 以前の右側指定を無効化

  // 表示用ミラーレイヤーの更新
  const text = textarea.value;
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const tagRegexGlobal = /\[(BGM|SE|BG):(.+?)\]/g;
  
  // タグを「透明化」し、その上にアイコンを浮かべることで文字幅のズレを防ぐ
  display.innerHTML = escapedText.replace(tagRegexGlobal, (match, type) => {
    const icon = type === 'BGM' ? '📻' : (type === 'SE' ? '🔊' : '🖼️');
    return `<span style="position:relative; display:inline-block; color:transparent; user-select:none; background:rgba(0,0,0,0.05); border-radius:3px;">${match}<span style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); color:#999; font-size:14px; pointer-events:auto; visibility:visible;" title="${match}">${icon}</span></span>`;
  });

  // スクロール位置を同期
  display.scrollTop = textarea.scrollTop;
  display.scrollLeft = textarea.scrollLeft;

  // コンテナがなければ作成
  let container = bar.querySelector('.sound-marker-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'sound-marker-container';
    bar.appendChild(container);
  }

  const lines = text.split('\n');

  // スタイル設定を動的に取得（フォントやパディングの変更によるズレを防止）
  const computedStyle = window.getComputedStyle(textarea);
  
  // 明示的な指定がない場合のフォールバックを1.5（HTML側の指定に合わせる）に修正
  const fontSize = parseFloat(computedStyle.fontSize);
  const lineHeight = parseFloat(computedStyle.lineHeight) || (fontSize * 1.5);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;

  container.innerHTML = '';
  // スクロール位置を同期
  container.style.transform = `translateY(${-textarea.scrollTop}px)`;

  lines.forEach((line, index) => {
    const bgmMatch = line.match(/\[BGM:(.+?)\]/);
    const seMatch = line.match(/\[SE:(.+?)\]/);
    const bgMatch = line.match(/\[BG:(.+?)\]/);

    if (bgmMatch || seMatch || bgMatch) {
      const marker = document.createElement('div');
      marker.className = 'sound-marker';
      
      let tooltips = [];
      if (bgmMatch && seMatch) {
        // BGMとSEの両方がある場合は黒
        marker.style.background = '#000';
        tooltips.push(`BGM: ${bgmMatch[1]}`);
        tooltips.push(`SE: ${seMatch[1]}`);
      } else if (bgmMatch) {
        marker.style.backgroundColor = '#ff9800'; // BGMはオレンジ
        tooltips.push(`BGM: ${bgmMatch[1]}`);
      } else if (seMatch) {
        marker.style.backgroundColor = '#2196f3'; // SEは青
        tooltips.push(`SE: ${seMatch[1]}`);
      } else if (bgMatch) {
        // 背景変更のみの場合は従来の青緑色
        marker.style.backgroundColor = '#008080';
        tooltips.push(`背景: ${bgMatch[1]}`);
      }

      // マウスホバー時に表示するテキストを設定
      marker.title = tooltips.join('\n');

      // 行の位置に合わせて「ー」のような細い横棒を表示
      // テキストエリアの境界線（border）も考慮して位置を調整
      marker.style.top = `${paddingTop + borderTop + (index * lineHeight) + (lineHeight / 2) - 1.5}px`;
      marker.style.left = '0'; // バーの基準位置（左端）に合わせる
      marker.style.height = '3px';
      marker.style.width = '20px';
      container.appendChild(marker);
    }
  });

  // 履歴の表示も更新
  updateSoundHistory();
}

/**
 * 文中の音響タグを解析してサイドバーの履歴リストを更新する
 */
function updateSoundHistory() {
  const textarea = document.getElementById('editor-body');
  const historyList = document.getElementById('sound-history-list');
  if (!textarea || !historyList) return;

  const text = textarea.value;
  const tagRegex = /\[(BGM|SE|BG):(.+?)\]/g;
  const matches = [];
  let match;

  // 全てのタグを抽出
  while ((match = tagRegex.exec(text)) !== null) {
    matches.push({ type: match[1], id: match[2] });
  }

  // 重複を除去しながら、新しい順（文末に近い順）に最大4件取得
  const uniqueItems = [];
  const seen = new Set();
  for (let i = matches.length - 1; i >= 0; i--) {
    const item = matches[i];
    const key = `${item.type}:${item.id}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueItems.push(item);
    }
    if (uniqueItems.length >= 4) break;
  }

  historyList.innerHTML = '';
  uniqueItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'sound-card';
    card.style.margin = '0';
    card.style.padding = '4px 12px';
    card.style.fontSize = '0.75rem';
    card.style.cursor = 'pointer';
    card.style.textAlign = 'left';
    
    // IDを日本語名に変換するマップ
    const soundNameMap = {
      '00-home': 'ホーム', 'audio-home': 'ホーム',
      '01-aki': '秋', '01-haru': '春', '01-huyu': '冬', '01-natu': '夏',
      '02-ame': '雨', '02-kaze': '風',
      '03-gakkou': '学校', '03-inaka': '田舎', '03-mori': '森', '03-tokai': '都会', '03-umi': '海',
      '04-bouken': '冒険', '04-sentou': '戦闘',
      '10-ame': '雨', '10-aruku': '歩く', '10-densya': '電車', '10-doa': 'ドア', '10-hasiru': '走る',
      '10-mati': '街', '10-mekuru': 'めくる', '10-natu': '夏', '10-nokku': 'ノック',
      '10-tokei': '時計', '10-umi': '海', 'audio-mekuru': 'めくる',
      'black': '黒', 'white': '白', 'underwater': '水中'
    };

    const displayName = soundNameMap[item.id] || item.id;
    let icon = item.type === 'BGM' ? '📻' : (item.type === 'SE' ? '🔊' : '🖼️');
    // コロンを全角にし、IDの代わりに日本語名を表示
    card.innerHTML = `<span>${icon} ${item.type}：${displayName}</span>`;
    
    card.onclick = () => {
      // IDをコピー
      navigator.clipboard.writeText(item.id).then(() => {
        const originalHTML = card.innerHTML;
        card.innerHTML = `<span style="color: #27ae60;">IDコピー & 再生中</span>`;
        setTimeout(() => { card.innerHTML = originalHTML; }, 1500);
      });

      // 音声を試聴（BGタグ以外）
      if (item.type !== 'BG') {
        const isHome = (item.id === '00-home' || item.id === 'audio-home');
        const targetAudio = document.getElementById(isHome ? 'audio-home' : item.id);
        if (targetAudio) {
          document.querySelectorAll('audio').forEach(a => {
            if (a !== targetAudio) {
              a.pause();
              a.currentTime = 0;
            }
          });
          const savedVolume = parseFloat(localStorage.getItem('globalVolume') || 0.4);
          targetAudio.volume = savedVolume;
          targetAudio.play().catch(e => console.log("Playback failed:", e));
        }
      }
    };
    historyList.appendChild(card);
  });
}

// エディタが存在する場合の初期化と入力監視
const editorTextArea = document.getElementById('editor-body');
if (editorTextArea) {
  editorTextArea.addEventListener('input', updateSoundIndicator);
  editorTextArea.addEventListener('scroll', updateSoundIndicator);
  window.addEventListener('resize', updateSoundIndicator);
  updateSoundIndicator();
}

// --- Googleログインボタンの処理 ---
// HTML側に id="login-btn" のボタンがあることを想定しています
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
  // firebase.js (type="module") によって window に Firebase 関連の関数がセットされるのを待つ
  const initAuth = () => {
    // window.auth や window.signInWithPopup が準備できるまで待機
    if (!window.auth || !window.onAuthStateChanged) {
      setTimeout(initAuth, 50); // 50ms ごとに再チェック
      return;
    }

    // ログイン・ログアウトのクリックイベント
    loginBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // グローバルクリックで閉じないように
      const errorMsgEl = document.getElementById('auth-error-message');
      if (errorMsgEl) errorMsgEl.textContent = ''; // 前回のエラーをクリア

      if (!window.auth.currentUser) {
        // Googleログインポップアップを表示
        window.signInWithPopup(window.auth, window.provider)
          .catch(e => {
            console.error("ログインエラー:", e);
            if (errorMsgEl) {
              if (e.code === 'auth/unauthorized-domain') {
                errorMsgEl.textContent = "このドメインはFirebaseで許可されていません。";
              } else if (e.code === 'auth/operation-not-allowed') {
                errorMsgEl.textContent = "Googleログインが無効です。Firebaseの設定を確認してください。";
              } else {
                errorMsgEl.textContent = `エラー: ${e.code}`;
              }
            }
          });
      } else {
        // ログイン済みの場合はドロップダウンメニューを表示
        const dropdown = document.getElementById('login-dropdown');
        if (dropdown) dropdown.classList.toggle('show');
      }
    });

    // ログイン状態の監視とUI更新
    window.onAuthStateChanged(window.auth, (user) => {
      // 再描画のため既存のドロップダウンを削除
      const existingDropdown = document.getElementById('login-dropdown');
      if (existingDropdown) existingDropdown.remove();

      if (user) {
        const photo = user.photoURL ? `<img src="${user.photoURL}" style="width:20px; height:20px; border-radius:50%;">` : '';
        loginBtn.innerHTML = `${photo}<span>${user.displayName || 'ログイン中'}</span>`;
        loginBtn.title = "メニューを表示";

        // ログイン用ドロップダウンを作成して追加
        const dropdown = document.createElement('div');
        dropdown.id = 'login-dropdown';
        dropdown.className = 'menu-dropdown';
        dropdown.innerHTML = `
          <div class="menu-item" id="go-my-stories">自分の作品一覧</div>
          <div class="menu-item danger" id="logout-action">ログアウト</div>
        `;
        loginBtn.parentElement.appendChild(dropdown);

        dropdown.querySelector('#go-my-stories').addEventListener('click', () => {
          const container = document.querySelector('.container');
          if (container) container.classList.add('camera-down-leave');
          
          if (window.playPageTurn) window.playPageTurn();
          if (window.saveBgmTime) window.saveBgmTime();
          
          setTimeout(() => {
            location.href = 'novels.html?filter=mine';
          }, 700);
        });

        dropdown.querySelector('#logout-action').addEventListener('click', () => {
          if (confirm('ログアウトしますか？')) {
            window.signOut(window.auth).then(() => {
              // ログアウト後はトップへ戻る演出
              saveBgmTime();
              location.href = 'index.html';
            });
          }
        });

      } else {
        loginBtn.innerHTML = '<span>Googleでログイン</span>';
        loginBtn.title = "";
      }
    });
  };

  initAuth();
}

// メニュー外をクリックした時に全てのドロップダウンを閉じる
window.addEventListener('click', () => {
  document.querySelectorAll('.menu-dropdown.show').forEach(el => el.classList.remove('show'));
});

injectResponsiveStyles();