# CARISMA HOUSE

صفحة هبوط عربية (RTL) فاخرة لمتجر مستلزمات أناقة رجالية: ساعات، أحزمة، محافظ وإكسسوارات. تتضمن نافذة طلب بقوائم ولاية/دائرة/بلدية جزائرية، وقائمة تنقل متجاوبة للجوال.

**الموقع المنشور:** يُضاف رابط Vercel هنا بعد أول نشر، بصيغة `https://carisma-house.vercel.app`

## التقنيات المستخدمة

- [Vite](https://vite.dev) 6 كأداة بناء وتشغيل
- HTML وCSS وJavaScript بدون إطار عمل
- [`algeria-geo`](https://github.com/test-bit-sys/algeria-geo) لبيانات الولايات والدوائر والبلديات
- خطّا Playfair Display وInter من Google Fonts
- النشر على Vercel (Static Site)

## التشغيل محليًا

يتطلب Node.js 20.19+ أو 22.12+.

```bash
npm install
npm run dev
```

لبناء نسخة النشر ومعاينتها:

```bash
npm run build
npm run preview
```

## النشر على Vercel

| الإعداد | القيمة |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

## هيكل الملفات

```
carisma-house/
├── assets/
│   ├── carisma-logo.png   # الشعار الرسمي CH بخلفية شفافة (المستخدم في الموقع)
│   └── *.jpg / *.jpeg     # الملفات المصدرية للشعار (غير مستخدمة في البناء)
├── src/
│   └── main.js            # نافذة الطلب وبيانات المناطق
├── index.html             # الصفحة الرئيسية
├── style.css              # التصميم العام والألوان
├── order.css              # تصميم نافذة الطلب
├── script.js              # قائمة الجوال والتمرير السلس
├── vite.config.js
└── package.json
```

## لوحة الألوان

| الاستخدام | اللون | القيمة |
|---|---|---|
| اللون الأساسي (ذهبي نحاسي) | ![](https://placehold.co/16x16/C9A227/C9A227.png) | `#C9A227` |
| ذهبي فاتح (تدرج وتفاعل) | ![](https://placehold.co/16x16/E3C766/E3C766.png) | `#E3C766` |
| ذهبي داكن (تدرج) | ![](https://placehold.co/16x16/8F6F12/8F6F12.png) | `#8F6F12` |
| الخلفية | ![](https://placehold.co/16x16/0D0D0D/0D0D0D.png) | `#0D0D0D` |
| الأسطح | ![](https://placehold.co/16x16/151413/151413.png) | `#151413` |
| النص | ![](https://placehold.co/16x16/F5F5F5/F5F5F5.png) | `#F5F5F5` |
| النص الثانوي | ![](https://placehold.co/16x16/A0A0A0/A0A0A0.png) | `#A0A0A0` |

## نافذة الطلب

- تُفتح من أزرار طلب المنتجات أو «ابدأ طلبك».
- تتحقق من رقم هاتف جزائري (محلي أو `+213`) ومن توافق البلدية مع الولاية.
- حاليًا تعرض معاينة قابلة للنسخ فقط؛ **لا ترسل أو تخزّن بيانات العملاء**. يلزم ربط Firebase أو نقطة استقبال طلبات قبل استخدامها لطلبات حقيقية.

## بيانات المناطق والتراخيص

تأتي بيانات التقسيمات من حزمة `algeria-geo`. راجع [مستودعها](https://github.com/test-bit-sys/algeria-geo) وملف `NOTICE` الخاص بها لمعلومات الترخيص والإسناد.
