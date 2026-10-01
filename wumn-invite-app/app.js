(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const fields = {
    clientName: $('#clientName'),
    brandName: $('#brandName'),
    businessType: $('#businessType'),
    speciality: $('#speciality'),
    phone: $('#phone'),
    email: $('#email')
  };

  const copyFields = {
    kicker: $('#cardKickerTemplate'),
    body: $('#cardBodyTemplate'),
    emphasis: $('#cardEmphasisTemplate'),
    footerLabel: $('#cardFooterLabelTemplate'),
    footerNote: $('#cardFooterNoteTemplate'),
    message: $('#messageTemplate')
  };

  const elements = {
    cardKicker: $('#cardKicker'),
    cardClientName: $('#cardClientName'),
    cardBrandName: $('#cardBrandName'),
    cardBody: $('#cardBody'),
    cardEmphasis: $('#cardEmphasis'),
    cardFooterLabel: $('#cardFooterLabel'),
    cardFooterNote: $('#cardFooterNote'),
    messageOutput: $('#messageOutput'),
    refreshMessageBtn: $('#refreshMessageBtn'),
    resetCopyBtn: $('#resetCopyBtn'),
    copyMessageBtn: $('#copyMessageBtn'),
    whatsappBtn: $('#whatsappBtn'),
    emailBtn: $('#emailBtn'),
    downloadBtn: $('#downloadBtn'),
    downloadHint: $('#downloadHint'),
    logoUpload: $('#logoUpload'),
    logoStatus: $('#logoStatus'),
    headerLogo: $('#headerLogo'),
    cardLogo: $('#cardLogo'),
    headerLogoFallback: $('#headerLogoFallback'),
    cardLogoFallback: $('#cardLogoFallback'),
    canvas: $('#exportCanvas')
  };

  let uploadedLogoDataUrl = '';
  let finalMessageDirty = false;

  const textTemplates = {
    warm: {
      kicker: 'A warm hello from WUMN',
      body: `We came across your work and genuinely loved what you’re creating.\n\nAt WUMN, we’re building a place where independent designers, boutiques and fashion brands can share their work, meet new customers and grow while staying true to what makes their brand special.`,
      emphasis: `We’d love to have {brand} with us.`,
      footerLabel: 'With warmth',
      footerNote: 'We’d love to know your story.',
      message: `Hi {client},\n\nA warm hello from Team WUMN.\n\nWe came across {brand} and genuinely loved what you’re creating{speciality_phrase}.\n\nAt WUMN, we’re building a place where independent designers, boutiques and fashion brands can share their work, meet new customers and grow while staying true to what makes their brand special.\n\nWe’d love to have {brand} with us, and we’d genuinely love to get to know you and your story.\n\nWith warmth,\nTeam WUMN\nwumn.in`
    },
    note: {
      kicker: 'A little note from WUMN',
      body: `Every brand begins with an idea, a passion and someone who believes in what they create.\n\nWe discovered {brand} and genuinely enjoyed seeing the thought and individuality behind your work. WUMN is being created as a home for independent fashion businesses to showcase what they love creating, connect with people who appreciate their work and grow together.`,
      emphasis: `We’d be so happy to welcome {brand} to WUMN.`,
      footerLabel: 'With warmth',
      footerNote: 'Here’s to everything you’re creating.',
      message: `Hi {client},\n\nA little note from Team WUMN.\n\nEvery brand begins with an idea, a passion and someone who believes in what they create. We discovered {brand} and genuinely enjoyed seeing the thought and individuality behind your work{speciality_phrase}.\n\nWUMN is being created as a home for independent designers, boutiques and fashion brands to showcase what they love creating, connect with people who appreciate their work and grow together.\n\nWe’d be so happy to welcome {brand} to WUMN, and we’d love to get to know you and your story.\n\nHere’s to everything you’re creating.\n\nWith warmth,\nTeam WUMN\nwumn.in`
    },
    welcome: {
      kicker: 'Hello {client},',
      body: `We came across your work and wanted to say hello.\n\nWUMN is a growing community for designers, boutiques and fashion brands to showcase their creations, connect with customers and build meaningful relationships around what they create. We’d love to learn more about {brand} and have you become a part of what we’re building.`,
      emphasis: `We’d love to welcome {brand} to WUMN.`,
      footerLabel: 'Warmly',
      footerNote: 'Come grow with us.',
      message: `Hi {client},\n\nWe came across {brand} and wanted to say hello. Your work caught our attention{speciality_phrase}.\n\nWUMN is a growing community for designers, boutiques and fashion brands to showcase their creations, connect with customers and build meaningful relationships around what they create.\n\nWe’d love to learn more about {brand} and would be delighted to welcome you to WUMN.\n\nCome grow with us.\n\nWarmly,\nTeam WUMN\nwumn.in`
    }
  };

  function clean(value, fallback) {
    const text = String(value || '').trim();
    return text || fallback;
  }

  function state() {
    return {
      client: clean(fields.clientName.value, 'Your Name'),
      brand: clean(fields.brandName.value, 'Your Boutique'),
      type: clean(fields.businessType.value, 'fashion business'),
      speciality: clean(fields.speciality.value, 'thoughtful, distinctive design'),
      phone: fields.phone.value.replace(/[^0-9]/g, ''),
      email: fields.email.value.trim(),
      tone: ($$('input[name="tone"]').find((item) => item.checked) || {}).value || 'warm'
    };
  }

  function interpolate(text, s) {
    const specialityPhrase = s.speciality ? `—especially ${s.speciality}` : '';
    return String(text || '')
      .replaceAll('{client}', s.client)
      .replaceAll('{brand}', s.brand)
      .replaceAll('{speciality}', s.speciality)
      .replaceAll('{speciality_phrase}', specialityPhrase)
      .replaceAll('{type}', s.type);
  }

  function editableCopy(s) {
    return {
      kicker: interpolate(copyFields.kicker.value, s),
      body: interpolate(copyFields.body.value, s),
      emphasis: interpolate(copyFields.emphasis.value, s),
      footerLabel: interpolate(copyFields.footerLabel.value, s),
      footerNote: interpolate(copyFields.footerNote.value, s)
    };
  }

  function generatedMessage(s) {
    return interpolate(copyFields.message.value, s);
  }

  function applyTemplate(tone, announce = false) {
    const template = textTemplates[tone] || textTemplates.warm;
    copyFields.kicker.value = template.kicker;
    copyFields.body.value = template.body;
    copyFields.emphasis.value = template.emphasis;
    copyFields.footerLabel.value = template.footerLabel;
    copyFields.footerNote.value = template.footerNote;
    copyFields.message.value = template.message;
    finalMessageDirty = false;
    update({ refreshMessage: true });
    if (announce) showToast('Style wording restored');
  }

  function update(options = {}) {
    const s = state();
    const copy = editableCopy(s);
    elements.cardKicker.textContent = copy.kicker;
    elements.cardClientName.textContent = s.client;
    elements.cardBrandName.textContent = s.brand;
    elements.cardBody.textContent = copy.body;
    elements.cardEmphasis.textContent = copy.emphasis;
    elements.cardFooterLabel.textContent = copy.footerLabel;
    elements.cardFooterNote.textContent = copy.footerNote;

    if (options.refreshMessage || !finalMessageDirty) {
      elements.messageOutput.value = generatedMessage(s);
      finalMessageDirty = false;
    }
  }

  function showToast(text) {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    requestAnimationFrame(() => toast.classList.add('show'));
    window.setTimeout(() => toast.classList.remove('show'), 1700);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(elements.messageOutput.value);
      showToast('Message copied');
    } catch {
      elements.messageOutput.select();
      document.execCommand('copy');
      showToast('Message copied');
    }
  }

  function openWhatsApp() {
    const s = state();
    const encoded = encodeURIComponent(elements.messageOutput.value);
    const destination = s.phone ? `https://wa.me/${s.phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(destination, '_blank', 'noopener,noreferrer');
  }

  function openEmail() {
    const s = state();
    const subject = encodeURIComponent(`A warm hello from WUMN · ${s.brand}`);
    const body = encodeURIComponent(elements.messageOutput.value);
    const address = encodeURIComponent(s.email || '');
    window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
  }

  function handleLogoError(img, fallback) {
    img.style.display = 'none';
    fallback.style.display = 'inline-block';
  }

  elements.headerLogo.addEventListener('error', () => handleLogoError(elements.headerLogo, elements.headerLogoFallback));
  elements.cardLogo.addEventListener('error', () => handleLogoError(elements.cardLogo, elements.cardLogoFallback));

  elements.logoUpload.addEventListener('change', () => {
    const file = elements.logoUpload.files && elements.logoUpload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      uploadedLogoDataUrl = String(reader.result || '');
      elements.headerLogo.src = uploadedLogoDataUrl;
      elements.cardLogo.src = uploadedLogoDataUrl;
      elements.headerLogo.style.display = 'block';
      elements.cardLogo.style.display = 'block';
      elements.headerLogoFallback.style.display = 'none';
      elements.cardLogoFallback.style.display = 'none';
      elements.logoStatus.textContent = `Using ${file.name}`;
      showToast('Logo ready for PNG export');
    };
    reader.readAsDataURL(file);
  });

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawWrappedParagraphs(ctx, text, x, y, maxWidth, lineHeight, paragraphGap, maxLines = 12) {
    const paragraphs = String(text || '').split(/\n\n+/);
    let currentY = y;
    let usedLines = 0;

    for (let p = 0; p < paragraphs.length; p += 1) {
      const lines = wrapLines(ctx, paragraphs[p], maxWidth);
      for (const line of lines) {
        if (usedLines >= maxLines) return currentY;
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
        usedLines += 1;
      }
      if (p < paragraphs.length - 1) currentY += paragraphGap;
    }
    return currentY;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function drawCard() {
    const s = state();
    const copy = editableCopy(s);
    const canvas = elements.canvas;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }

    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#fffdf9');
    bg.addColorStop(1, '#f8f1ec');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const roseGlow = ctx.createRadialGradient(80, 130, 10, 80, 130, 430);
    roseGlow.addColorStop(0, 'rgba(236,37,88,.12)');
    roseGlow.addColorStop(1, 'rgba(236,37,88,0)');
    ctx.fillStyle = roseGlow;
    ctx.fillRect(0, 0, 620, 620);

    const peachGlow = ctx.createRadialGradient(1000, 1150, 0, 1000, 1150, 420);
    peachGlow.addColorStop(0, 'rgba(255,176,132,.16)');
    peachGlow.addColorStop(1, 'rgba(255,176,132,0)');
    ctx.fillStyle = peachGlow;
    ctx.fillRect(550, 760, 530, 590);

    ctx.strokeStyle = 'rgba(78,63,54,.15)';
    ctx.lineWidth = 2;
    roundedRect(ctx, 24, 24, W - 48, H - 48, 30);
    ctx.stroke();

    let logoDrawn = false;
    try {
      const logoSrc = uploadedLogoDataUrl || 'assets/wumn-logo.png';
      const img = await loadImage(logoSrc);
      const targetH = 78;
      const ratio = img.width / img.height || 0.9;
      ctx.drawImage(img, 86, 66, targetH * ratio, targetH);
      logoDrawn = true;
    } catch {}

    if (!logoDrawn) {
      ctx.fillStyle = '#171717';
      ctx.font = '700 42px "Manrope", Arial, sans-serif';
      ctx.fillText('WUMN', 86, 112);
    }

    ctx.fillStyle = '#7b726a';
    ctx.font = '600 18px "Manrope", Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('wumn.in', 994, 105);
    ctx.textAlign = 'left';

    const top = 285;
    ctx.fillStyle = '#c81246';
    ctx.font = '700 17px "Manrope", Arial, sans-serif';
    ctx.fillText(copy.kicker.toUpperCase(), 86, top);

    ctx.fillStyle = '#171717';
    ctx.font = '500 86px "Playfair Display", Georgia, serif';
    const clientLines = wrapLines(ctx, s.client, 860).slice(0, 2);
    clientLines.forEach((line, index) => ctx.fillText(line, 86, top + 104 + index * 86));

    const brandY = top + 104 + clientLines.length * 86 + 14;
    ctx.fillStyle = '#554f49';
    ctx.font = '600 25px "Manrope", Arial, sans-serif';
    const brandLines = wrapLines(ctx, s.brand.toUpperCase(), 860).slice(0, 2);
    brandLines.forEach((line, index) => ctx.fillText(line, 86, brandY + index * 36));

    const ruleY = brandY + brandLines.length * 36 + 44;
    ctx.fillStyle = '#ec2558';
    ctx.fillRect(86, ruleY, 76, 3);

    ctx.fillStyle = '#47413c';
    ctx.font = '400 25px "Manrope", Arial, sans-serif';
    const bodyY = ruleY + 64;
    const bodyBottom = drawWrappedParagraphs(ctx, copy.body, 86, bodyY, 875, 41, 18, 12);

    ctx.fillStyle = '#171717';
    ctx.font = '500 30px "Playfair Display", Georgia, serif';
    const emphasisY = Math.min(Math.max(bodyBottom + 28, 1000), 1092);
    const emphasisLines = wrapLines(ctx, copy.emphasis, 875).slice(0, 2);
    emphasisLines.forEach((line, index) => ctx.fillText(line, 86, emphasisY + index * 38));

    ctx.fillStyle = '#817971';
    ctx.font = '700 14px "Manrope", Arial, sans-serif';
    ctx.fillText(copy.footerLabel.toUpperCase(), 86, 1212);
    ctx.fillStyle = '#171717';
    ctx.font = '500 31px "Playfair Display", Georgia, serif';
    ctx.fillText('Team WUMN', 86, 1257);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#706861';
    ctx.font = '500 16px "Manrope", Arial, sans-serif';
    const footerLines = wrapLines(ctx, copy.footerNote, 370).slice(0, 2);
    footerLines.forEach((line, index) => ctx.fillText(line, 994, 1233 + index * 25));
    ctx.textAlign = 'left';
  }

  async function downloadCard() {
    const s = state();
    elements.downloadBtn.disabled = true;
    elements.downloadBtn.textContent = 'Preparing PNG…';
    elements.downloadHint.textContent = 'Creating a high-resolution 1080 × 1350 image.';
    try {
      await drawCard();
      const link = document.createElement('a');
      const safeBrand = s.brand.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'client';
      link.download = `wumn-warm-welcome-${safeBrand}.png`;
      link.href = elements.canvas.toDataURL('image/png');
      link.click();
      showToast('Welcome card downloaded');
      elements.downloadHint.textContent = 'PNG downloaded. Ready for Instagram, WhatsApp or email.';
    } catch (error) {
      console.error(error);
      elements.downloadHint.textContent = 'Could not export the card. Try choosing the WUMN logo again under Logo settings.';
      showToast('Could not export card');
    } finally {
      elements.downloadBtn.disabled = false;
      elements.downloadBtn.textContent = 'Download personalised card';
    }
  }

  Object.values(fields).forEach((field) => field.addEventListener('input', () => update()));
  Object.values(fields).forEach((field) => field.addEventListener('change', () => update()));
  Object.values(copyFields).forEach((field) => field.addEventListener('input', () => update()));

  $$('input[name="tone"]').forEach((item) => item.addEventListener('change', () => {
    applyTemplate(item.value);
  }));

  elements.messageOutput.addEventListener('input', () => { finalMessageDirty = true; });
  elements.refreshMessageBtn.addEventListener('click', () => {
    finalMessageDirty = false;
    update({ refreshMessage: true });
    showToast('Message refreshed');
  });
  elements.resetCopyBtn.addEventListener('click', () => applyTemplate(state().tone, true));
  elements.copyMessageBtn.addEventListener('click', copyMessage);
  elements.whatsappBtn.addEventListener('click', openWhatsApp);
  elements.emailBtn.addEventListener('click', openEmail);
  elements.downloadBtn.addEventListener('click', downloadCard);

  applyTemplate('warm');
})();
