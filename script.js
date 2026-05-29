// Global variable to hold the audio hint element (the small text below volume bar)
let audioHintElement = null;
let audioPlayedSuccessfully = localStorage.getItem('audio_permitted') === 'true';

// Function to create and append the audio hint
const createAudioHint = () => {
  if (audioHintElement) return; // Already created

  audioHintElement = document.createElement('div');
  audioHintElement.id = 'audio-play-hint'; // New ID for styling
  audioHintElement.textContent = 'クリックで音楽を再生'; // The desired text
  audioHintElement.style.display = 'none'; // Initially hidden
  document.body.appendChild(audioHintElement);

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

  // 既に再生中なら何もしない
  if (!homeAudio.paused) return;

    const savedVolume = localStorage.getItem('globalVolume') || 0.4;
    homeAudio.volume = savedVolume;

    // 前のページから引き継いだ再生時間をセット
    const savedTime = localStorage.getItem('bgm_time');
    if (savedTime && !homeAudio.dataset.timeSet) {
      homeAudio.currentTime = parseFloat(savedTime);
      homeAudio.dataset.timeSet = "true"; // 二重セット防止
    }

    homeAudio.play()
      .then(() => {
        // 成功した場合
        audioPlayedSuccessfully = true;
        localStorage.setItem('audio_permitted', 'true');
        hideAudioHint();
        // 成功したら、自動再生試行のイベントリスナーは不要なので解除
        window.removeEventListener('click', startHomeBgm);
        window.removeEventListener('keydown', startHomeBgm);
      })
      .catch(e => {
        // 失敗した場合
        console.log("BGM playback failed:", e);
        // どのような理由であれ再生に失敗したらヒントを表示
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

// 遷移時に現在の再生時間を保存する関数
const saveBgmTime = () => {
  const homeAudio = document.getElementById('audio-home');
  if (homeAudio) {
    localStorage.setItem('bgm_time', homeAudio.currentTime);
  }
};

// SE再生関数を追加
const playPageTurn = () => {
  const mekuru = document.getElementById('audio-mekuru');
  if (mekuru) {
    const savedVolume = localStorage.getItem('globalVolume') || 0.4;
    mekuru.volume = savedVolume;
    mekuru.play().catch(e => console.log("SE playback failed:", e));
  }
};

const readBtn = document.getElementById('read-btn');
if (readBtn) {
  readBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'read/novels.html';
    }, 700);
  });
}

const writeBtn = document.getElementById('write-btn');
if (writeBtn) {
  writeBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'write/write.html';
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
    const contentInput = document.querySelector('.editor-inner-container textarea');

    const draft = {
      title: titleInput ? titleInput.value : '',
      author: authorInput ? authorInput.value : '',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput ? contentInput.value : ''
    };
    localStorage.setItem('draft_story', JSON.stringify(draft));

    const container = document.querySelector('.container');
    container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      // ファイルの場所（ルートかwriteフォルダ内か）を判定して遷移
      const isInWriteFolder = window.location.pathname.includes('/write/');
      location.href = isInWriteFolder ? 'BGM・SE.html' : 'write/BGM・SE.html';
    }, 700);
  });
}

// 音響一覧からエディタ画面へ戻る
document.querySelectorAll('#back-to-editor, #back-to-editor-top').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    container.classList.add('camera-down-leave');
    playPageTurn();
    saveBgmTime();
    setTimeout(() => {
      location.href = 'write.html';
    }, 700);
  });
});

// 作品一覧にある全ての「読む」ボタンにカメラ移動演出を適用
document.querySelectorAll('.story-card .btn.primary').forEach(btn => {
  btn.addEventListener('click', () => {
    // 静的な作品（終電の後など）を読む場合は、動的IDをクリアする
    localStorage.removeItem('current_story_id');
    
    const container = document.querySelector('.container');
    container.classList.add('camera-down-leave');
    playPageTurn();
    // 小説を読む時はBGMの続きは不要なのでリセット
    localStorage.removeItem('bgm_time');
    setTimeout(() => {
      location.href = 'read.html';
    }, 700);
  });
});

// --- 投稿機能の実装 ---
const publishBtn = document.querySelector('.library-panel .sound-button.primary');
if (publishBtn) {
  publishBtn.addEventListener('click', () => {
    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.querySelector('.editor-inner-container textarea');

    if (!contentInput.value.trim()) {
      alert('本文を入力してください。');
      return;
    }

    const stories = JSON.parse(localStorage.getItem('user_stories') || '[]');
    const newStory = {
      id: Date.now(),
      title: titleInput.value.trim() || '無題の物語',
      author: authorInput.value.trim() || '名無しさん',
      desc: contentInput.value.substring(0, 40).replace(/\n/g, ' ') + '...',
      preface: prefaceInput ? prefaceInput.value : '',
      content: contentInput.value
    };

    stories.push(newStory);
    localStorage.setItem('user_stories', JSON.stringify(stories));

    alert('物語を投稿しました！');
    localStorage.removeItem('draft_story');
    playPageTurn();
    location.href = '../read/novels.html';
  });
}

// --- 下書き保存機能の実装 ---
const draftBtn = document.querySelector('.library-panel .sound-button:not(.primary)');
if (draftBtn) {
  draftBtn.addEventListener('click', () => {
    const titleInput = document.getElementById('editor-title');
    const authorInput = document.getElementById('editor-author');
    const prefaceInput = document.getElementById('editor-preface');
    const contentInput = document.querySelector('.editor-inner-container textarea');

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
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      titleInput.value = draft.title || '';
      const authorInput = document.getElementById('editor-author');
      if (authorInput) authorInput.value = draft.author || '';
      const prefaceInput = document.getElementById('editor-preface');
      if (prefaceInput) prefaceInput.value = draft.preface || '';
      const contentInput = document.querySelector('.editor-inner-container textarea');
      if (contentInput) contentInput.value = draft.content || '';
      updateSoundIndicator();
    }
  }
}

// --- 作品一覧の動的表示 ---
const libraryGrid = document.querySelector('.library-section .story-grid');
if (libraryGrid) {
  const userStories = JSON.parse(localStorage.getItem('user_stories') || '[]');
  userStories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.innerHTML = `
      <h3>${story.title}</h3>
      <p class="story-author">by ${story.author}</p>
      <p class="story-desc">${story.desc}</p>
      <div class="card-buttons" style="display: flex; gap: 10px;">
        <button class="btn primary user-story-btn" data-id="${story.id}">読む</button>
        <button class="btn danger delete-story-btn" data-id="${story.id}">削除</button>
      </div>
    `;
    libraryGrid.appendChild(card);
  });

  // 動的に生成されたボタンへのクリックイベント（委譲）
  libraryGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('user-story-btn')) {
      const storyId = e.target.dataset.id;
      localStorage.setItem('current_story_id', storyId);
      
      const container = document.querySelector('.container');
      if (container) container.classList.add('camera-down-leave');
      
      playPageTurn();
      localStorage.removeItem('bgm_time');
      
      setTimeout(() => {
        location.href = 'read.html';
      }, 700);
    }

    if (e.target.classList.contains('delete-story-btn')) {
      if (confirm('この物語を削除してもよろしいですか？')) {
        const storyId = e.target.dataset.id;
        let stories = JSON.parse(localStorage.getItem('user_stories') || '[]');
        stories = stories.filter(s => s.id != storyId);
        localStorage.setItem('user_stories', JSON.stringify(stories));
        
        // 画面からカードを削除
        e.target.closest('.story-card').remove();
        
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
    container.classList.add('camera-down-leave');
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
      container.classList.add('camera-down-leave');
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
  const savedVolume = localStorage.getItem('globalVolume') || 0.4;
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
    const audioId = card.dataset.audio;
    if (!audioId) return;

    // IDをクリップボードにコピー
    navigator.clipboard.writeText(audioId).then(() => {
      const originalText = card.innerHTML;
      card.innerHTML = `<span style="font-size: 0.8rem; color: #27ae60;">コピー完了！</span>`;
      setTimeout(() => {
        card.innerHTML = originalText;
      }, 1000);
    });

    const targetAudio = document.getElementById(audioId);
    if (!targetAudio) return;

    // 現在再生中のすべての音声を停止して切り替える
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    const savedVolume = localStorage.getItem('globalVolume') || 0.4;
    targetAudio.volume = savedVolume;
    targetAudio.play().catch(e => console.log("Audio play failed:", e));
  });
});

// エディタ画面：BGM/SEタグ挿入機能
const addSoundBtn = document.getElementById('add-sound-btn');

const insertSoundTag = (type) => {
  const textarea = document.querySelector('.editor-inner-container textarea');
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  let promptMsg = `${type}のIDを入力してください（一覧でコピーしたIDを貼り付けてください）`;
  let defaultVal = 'audio-';
  
  if (type === 'BG') {
    promptMsg = "背景の色（例: black, #333）または設定したいクラス名を入力してください。";
    defaultVal = 'black';
  }

  const id = prompt(promptMsg, defaultVal);
  if (!id) return;
  
  const tag = `[${type}:${id}]`;
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
};

if (addSoundBtn) {
  addSoundBtn.addEventListener('click', () => insertSoundTag('BGM'));
}

// 読書画面：一行ずつ表示する演出
const textBody = document.querySelector('.text-body');
if (textBody) {
  // --- 保存された物語の読み込み ---
  const storyId = localStorage.getItem('current_story_id');
  if (storyId) {
    const stories = JSON.parse(localStorage.getItem('user_stories') || '[]');
    const story = stories.find(s => s.id == storyId);
    
    if (story) {
      // タイトルと著者を書き換え
      const titleEl = document.querySelector('.story-title');
      const authorEl = document.querySelector('.story-author-name');
      if (titleEl) titleEl.textContent = story.title;
      if (authorEl) authorEl.textContent = story.author + ' 著';

      // 本文を入れ替え
      const endMarker = document.getElementById('story-end-marker');
      textBody.innerHTML = ''; // 既存の「終電の後」を消去
      
      const allLines = [];
      if (story.preface) allLines.push(...story.preface.split('\n').filter(l => l.trim()));
      allLines.push(...story.content.split('\n').filter(l => l.trim()));

      allLines.forEach(lineText => {
        const p = document.createElement('p');
        p.textContent = lineText;
        textBody.appendChild(p);
      });
      if (endMarker) textBody.appendChild(endMarker);
    }
  }

  const lines = textBody.querySelectorAll('p');
  let currentLineIndex = 0;

  // 空間を2行分だけ用意しておく（中身は見せない）
  for (let i = 0; i < 2; i++) {
    if (currentLineIndex < lines.length) {
      lines[i].classList.add('is-placeholder');
    }
  }
  currentLineIndex = 0; // 最初のクリックで1行目から表示させる

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

      // 音声タグ（BGMまたはSE）が含まれていない文の場合、再生中の音声をフェードアウトさせる
      const hasAudioTag = /\[(BGM|SE):.+?\]/.test(currentLine.textContent);
      if (!hasAudioTag) {
        document.querySelectorAll('audio').forEach(a => {
          if (a.id !== 'audio-home' && a.id !== 'audio-mekuru' && !a.paused && a.volume > 0) {
            fadeOut(a, 1000);
          }
        });
      }

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

      // 新しい行が画面の中央に来るように自動スクロール
      currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentLineIndex++;

      // 最後の行を表示し終えたら、少し待ってからENDを出す
      if (currentLineIndex === lines.length) {
        const endMarker = document.getElementById('story-end-marker');
        if (endMarker) {
          setTimeout(() => {
            endMarker.classList.add('is-visible');
          }, 1200); // 1.2秒待ってからゆっくり表示
        }
      }
    }
  };

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
  const textarea = document.querySelector('.editor-inner-container textarea');
  const bar = document.getElementById('sound-indicator-bar');
  if (!textarea || !bar) return;

  // コンテナがなければ作成
  let container = bar.querySelector('.sound-marker-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'sound-marker-container';
    bar.appendChild(container);
  }

  const text = textarea.value;
  const lines = text.split('\n');
  
  // 設定値 (CSSのfont-sizeとline-heightに合わせる)
  const fontSize = 22;
  const lineHeight = fontSize * 1.5; // 33px
  const paddingTop = 20; // 文字と同じ位置（中央付近）になるよう調整

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
      // BGMまたはSEが設定されている場合はオレンジに統一
      if (bgmMatch || seMatch) {
        marker.style.backgroundColor = '#ff9800'; 
        if (bgmMatch) tooltips.push(`BGM: ${bgmMatch[1]}`);
        if (seMatch) tooltips.push(`SE: ${seMatch[1]}`);
      } else if (bgMatch) {
        // 背景変更のみの場合は従来の青緑色
        marker.style.backgroundColor = '#008080';
        tooltips.push(`背景: ${bgMatch[1]}`);
      }

      // マウスホバー時に表示するテキストを設定
      marker.title = tooltips.join('\n');

      // 行の位置に合わせて「ー」のような細い横棒を表示
      marker.style.top = `${paddingTop + (index * lineHeight)}px`;
      marker.style.height = '6px';
      container.appendChild(marker);
    }
  });
}

// エディタが存在する場合の初期化と入力監視
const editorTextArea = document.querySelector('.editor-inner-container textarea');
if (editorTextArea) {
  editorTextArea.addEventListener('input', updateSoundIndicator);
  editorTextArea.addEventListener('scroll', updateSoundIndicator);
  updateSoundIndicator();
}