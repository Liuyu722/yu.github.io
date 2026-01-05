// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 1. 页面加载动画
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading';
  loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loadingScreen);

  // 加载完成后隐藏加载动画
  window.addEventListener('load', function() {
    setTimeout(function() {
      loadingScreen.style.opacity = '0';
      setTimeout(function() {
        loadingScreen.remove();
      }, 500);
    }, 800);
  });

  // 2. 平滑滚动（点击导航锚点时）
  const navLinks = document.querySelectorAll('nav a[href^="#"], .footer-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // 平滑滚动到目标位置
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // 更新导航激活状态
        document.querySelectorAll('nav a.active').forEach(activeLink => {
          activeLink.classList.remove('active');
        });
        // 如果是导航栏的链接才添加active，排除页脚链接
        if (this.closest('nav')) {
          this.classList.add('active');
        }
      }
    });
  });

  // 3. 图片点击预览功能
  // 创建弹窗元素
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <span class="close-modal">&times;</span>
    <img class="modal-content" id="modal-img">
  `;
  document.body.appendChild(modal);

  const modalImg = document.getElementById('modal-img');
  const closeModal = document.querySelector('.close-modal');

  // 给所有照片添加点击事件
  const photoItems = document.querySelectorAll('.photo-item img, .star-photos img, .show-card img');
  photoItems.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      // 禁止页面滚动
      document.body.style.overflow = 'hidden';
    });
  });

  // 关闭弹窗
  function closeModalFunc() {
    modal.style.display = 'none';
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
  }

  closeModal.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', function(e) {
    // 点击弹窗背景也关闭
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // 按ESC键关闭弹窗
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModalFunc();
    }
  });

  // 4. 滚动时导航栏样式变化
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.padding = '10px 0';
      header.style.boxShadow = '0 5px 15px rgba(255, 200, 80, 0.4)';
    } else {
      header.style.padding = '15px 0';
      header.style.boxShadow = '0 3px 10px rgba(255, 200, 80, 0.3)';
    }

    // 滚动时更新导航激活状态（根据当前可视区域的板块）
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('nav a.active').forEach(activeLink => {
          activeLink.classList.remove('active');
        });
        const correspondingLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  });

  // 5. 图片加载失败处理（显示默认图片）
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    img.addEventListener('error', function() {
      // 替换为默认图片（可根据需要修改路径）
      this.src = 'images/default.jpg';
      this.alt = '图片加载失败';
    });
  });

  // 6. 给页脚版权年份自动更新
  const copyrightYear = document.querySelector('.copyright p');
  if (copyrightYear) {
    const currentYear = new Date().getFullYear();
    copyrightYear.innerHTML = `&copy; ${currentYear} 生活碎片博客 · 所有分享仅供娱乐`;
  }
});