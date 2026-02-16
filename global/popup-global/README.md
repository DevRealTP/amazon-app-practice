Global Stackable Amazon-Style Bottom Sheet Popups (Up to 25)

This project provides a **global, production-ready bottom-sheet popup system**
(Amazon / iOS style) with **stacked logic support up to 25 popups**.

✅ Popup A → Popup B → Popup C … (up to 25)  
✅ Closing top popup returns to the previous one  
✅ One shared overlay (darkens slightly per level, capped)  
✅ Drag-down-to-close works **only on the top popup**  
✅ X button always works (mobile + desktop)  
✅ No frameworks, no per-popup JS  
✅ Works globally across your site  

---

> ⚠️ UX note: Even though 25 is supported, **2–3 stacked popups is ideal UX**.


--------------------------------------------------

## 1. Add the Global Overlay (ONCE per page)

Place this near the end of `<body>`:

```html
<div class="overlay" id="overlay"></div>
This overlay is shared by all popups

EXAMPLE:

<div class="popup" id="popupA" data-popup> <!-- popup -->
  <div class="handle"></div> <!-- box -->
  <div class="close" data-close>&times;</div> <!-- X button -->

  <div class="popup-image"> <!-- Image container -->
    <img src="image.jpg" alt=""> <!-- Image -->
  </div>

  <div class="content"> <!-- All contnet -->
    <h1>Popup A</h1>
    <p>Some content</p>

    <button data-open="popupB">Open Popup B</button><!-- Buttons -->
    <button data-close>Close</button>               <!-- (Optional) -->
  </div>
</div>

---------------------------------------------------------

3. Required Data Attributes

Attribute	           | Purpose
                     |
data-popup	         | Marks an element as a popup
data-open="popupId"	 | Opens another popup
data-close	         | Closes the topmost popup

---------------------------------------------------------

5. Include CSS & JS Globally

In <head>:

<link rel="stylesheet" href="./css/popup.css">


Before </body>:

<script src="./js/popup-stack.js"></script>


---------------------------------------------------------

6. Usage Examples
Open via HTML
<button data-open="popupA">Open Popup A</button>

Open via JavaScript
PopupStack.open("popupA");

Close top popup
PopupStack.closeTop();

---------------------------------------------------------

Summary

✔ Up to 25 stacked popups
✔ Safe, global, reusable
✔ Mobile-first drag behavior
✔ Reliable close logic
✔ Amazon-style UX

You now have a scalable popup system ready for real production use.