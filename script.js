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
  publishBtn.addEventListener('click', () => {
    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.getElementById('editor-body');

    if (!contentInput.value.trim()) {
      alert('本文を入力してください。');
      return;
    }

    const newStory = {
      title: titleInput.value.trim() || '無題の物語',
      author: authorInput.value.trim() || '名無しさん',
      // 作品一覧の著作者名の下に表示する文として「前置き」を使用
      desc: prefaceInput ? prefaceInput.value.trim() : '',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput.value
    };

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

// --- 作品一覧の動的表示 ---
const libraryGrid = document.querySelector('.library-section .story-grid');
if (libraryGrid) {
  const loadStories = async () => {
    try {
      const q = window.query(window.collection(window.db, 'stories'), window.orderBy('createdAt', 'desc'));
      const querySnapshot = await window.getDocs(q);
      
      querySnapshot.forEach((doc) => {
        const story = doc.data();
        const storyId = doc.id;
        const card = document.createElement('div');
        card.className = 'story-card';
        
        let descText = (story.preface && story.preface.trim() !== "") ? story.preface : "";
        let cleanDesc = descText.replace(/\[(BGM|SE|BG):.+?\]/g, '').replace(/\n/g, ' ');
        if (cleanDesc.length > 80) cleanDesc = cleanDesc.substring(0, 80) + '...';

        card.innerHTML = `
          <h3>${story.title}</h3>
          <p class="story-author">by ${story.author}</p>
          <p class="story-desc">${cleanDesc}</p>
          <div class="card-buttons" style="display: flex; gap: 10px;">
            <button class="btn primary user-story-btn" data-id="${storyId}">読む</button>
            <button class="btn danger delete-story-btn" data-id="${storyId}">削除</button>
          </div>
        `;
        libraryGrid.appendChild(card);
      });
    } catch (e) {
      console.error("作品の取得に失敗しました:", e);
    }
  };
  loadStories();

  // 動的に生成されたボタンへのクリックイベント（委譲）
  libraryGrid.addEventListener('click', (e) => {
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

    if (e.target.classList.contains('delete-story-btn')) {
      if (confirm('この物語をFirebaseから削除してもよろしいですか？')) {
        const storyId = e.target.dataset.id;
        window.deleteDoc(window.doc(window.db, 'stories', storyId)).then(() => {
          e.target.closest('.story-card').remove();
        }).catch(err => {
          alert("削除に失敗しました");
          console.error(err);
        });
        
        playPageTurn();
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
  (async () => {
    // --- Firebaseから物語を読み込み ---
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
              footer.style.display = 'block'; // PCでの親要素非表示を解除
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
injectResponsiveStyles();