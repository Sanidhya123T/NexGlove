Update the existing NexGlove UI. Do NOT redesign the application from scratch.

The existing UI structure, functionality, controls table, bottom status bar, and overall desktop layout are already correct. This is a controlled visual redesign and glove-visualization update.

IMPORTANT:
Use the existing project structure and existing interactions wherever possible.
Do not remove existing functionality.
Do not create unnecessary new screens.
Do not change the controls-table structure.
Do not change the bottom status bar structure.
Do not introduce B5 anywhere. NexGlove has EXACTLY FOUR glove buttons: B1, B2, B3, B4.

==================================================
1. BRANDING & COLOR THEME
==================================================

Replace the old visual color theme with the NexGlove brand direction:

PRIMARY:
- Deep Navy

ACCENT:
- Bright NexGlove Blue

SECONDARY:
- White

Use subtle cool light-gray/blue-gray tones for borders and secondary surfaces where needed.

The UI must look:
- clean
- professional
- modern
- premium hardware companion software
- technically polished
- easy to understand

DO NOT use:
- gradients
- glowing neon effects
- excessive shadows
- gaming-style effects
- unnecessary glassmorphism
- excessive decorative elements

The NexGlove logo provided by the user is the branding reference.
Use the actual NexGlove logo rather than recreating or approximating it.

==================================================
2. HEADER
==================================================

Keep the existing header structure and general placement.

Use the NexGlove logo prominently.

The header should communicate:

NexGlove

AI/ML GESTURE CONTROL

Wearable Control. Limitless Possibilities.

Make "AI/ML GESTURE CONTROL" visually prominent enough to communicate the key technology.

" Wearable Control. Limitless Possibilities. " should act as the supporting tagline.

Keep the header clean and compact.
Do not make the header excessively tall.

==================================================
3. OVERALL PAGE LAYOUT
==================================================

KEEP THE EXISTING PAGE STRUCTURE.

Use the current two-column desktop layout:

LEFT:
- My Custom Controls
- Controls list/table
- Add Control
- Default Button Functions

RIGHT:
- Large interactive glove visualization
- Hand/view information
- Interaction/testing area

The left controls section should remain approximately the same size and position as the current UI.

Do not unnecessarily rearrange the application.

==================================================
4. MY CUSTOM CONTROLS
==================================================

KEEP THE CURRENT CONTROLS LIST/TABLE.

Do not redesign the table structure.

Keep:
- Operation/action
- Button combination
- Edit
- Delete
- Existing rows
- Existing spacing and usability

The existing controls list is already good.

Only update its colors, borders, typography, and visual styling so it matches the new NexGlove navy/blue/white theme.

==================================================
5. DEFAULT BUTTON FUNCTIONS
==================================================

At the bottom of the LEFT PANEL, retain/create a clearly separated section titled:

DEFAULT BUTTON FUNCTIONS

There are EXACTLY FOUR default buttons:

B1    →    Left Click
B2    →    Right Click
B3    →    Scroll
B4    →    Gyroscope ON/OFF

Present these as clean, compact rows/cards.

Make it visually clear that these are DEFAULT functions and are different from MY CUSTOM CONTROLS.

Do NOT include B5.
Do NOT include B5-upper.
Do NOT include B5-lower.

==================================================
6. GLOVE VISUALIZATION — CRITICAL
==================================================

Replace the current glove artwork with a polished 2D technical illustration based on the user's FIRST palm reference image.

The glove must be:

- right hand
- palm facing the viewer
- fingers pointing upward
- thumb on the RIGHT side
- clean 2D technical/product illustration
- anatomically understandable
- visually polished
- suitable for a professional hardware companion application

Do NOT use the existing palm artwork if its orientation is incorrect.

The user's first palm reference image is the authority for the palm structure and orientation.

The glove should look like a real wearable glove represented through a clean technical illustration.

Target visual style:
A balance between:
- clean 2D technical illustration
AND
- realistic/product-like hardware visualization

Do NOT make it cartoonish.
Do NOT make it photorealistic.
Do NOT make it robotic or sci-fi unnecessarily.

==================================================
7. GLOVE BUTTON POSITIONS — ABSOLUTELY CRITICAL
==================================================

There are EXACTLY FOUR buttons.

Their physical locations MUST be:

B1:
Underneath the LITTLE FINGER.

B2:
Underneath the RING FINGER.

B3:
Underneath the MIDDLE FINGER.

B4:
Between the INDEX FINGER and THUMB.

The positions must correspond to the physical locations described above.

IMPORTANT:
Do NOT interpret the labels from the old glove artwork.
Do NOT move B1/B2/B3/B4 to the fingertips.
Do NOT place B1 on the thumb.
Do NOT create B5.

The glove artwork should clearly communicate these four physical button locations.

Each button should be visually distinct and clickable.

==================================================
8. GLOVE INTERACTION
==================================================

Keep the existing interactive glove concept.

The user must be able to select B1, B2, B3, and B4 directly by clicking/tapping the corresponding button on the glove.

Selected buttons should have a clear visual state using the NexGlove blue accent.

For example:

UNSELECTED:
subtle neutral button

SELECTED:
bright NexGlove blue / clear active state

The active state should be obvious but NOT neon or glowing.

When buttons are selected, the UI should clearly communicate:

Selected:
B1 + B3

or whatever combination is currently selected.

==================================================
9. ADD CONTROL
==================================================

Keep the existing "+ Add Control" functionality.

When the user opens Add Control:

The user must be able to:
1. Choose an action.
2. Select B1/B2/B3/B4 using controls inside the modal.
3. OR select B1/B2/B3/B4 directly from the glove.
4. Both selection methods must remain synchronized.

Example:

Action:
Copy

Selected buttons:
B1 + B2

Result:
B1 + B2 → Copy

The interaction should feel intuitive and require minimal explanation.

Do not introduce B5.

==================================================
10. RIGHT-SIDE GLOVE AREA
==================================================

The glove should be the main visual element on the RIGHT SIDE.

Make it large enough to clearly see:
- palm structure
- fingers
- thumb
- B1
- B2
- B3
- B4

Do not make the glove unnecessarily huge.

Use the existing right-side composition as the layout reference.

Retain the existing:
- hand/view information
- testing concept
- surrounding UI structure

Only improve the visual presentation to match the new design.

==================================================
11. BOTTOM STATUS BAR
==================================================

KEEP THE EXISTING BOTTOM STATUS BAR.

Do not remove or redesign its information structure.

Retain:
- battery status
- connection status
- hand detection status
- settings
- version

Update only its colors/visual styling to match the new NexGlove theme.

==================================================
12. TYPOGRAPHY
==================================================

Use a clean modern sans-serif typeface.

Prioritize:
- strong readability
- clear hierarchy
- compact labels
- professional technical appearance

Suggested hierarchy:

NexGlove
→ brand

AI/ML GESTURE CONTROL
→ primary capability statement

Wearable Control. Limitless Possibilities.
→ supporting tagline

MY CUSTOM CONTROLS
→ section heading

DEFAULT BUTTON FUNCTIONS
→ section heading

Keep typography consistent throughout the application.

==================================================
13. SPACING & VISUAL QUALITY
==================================================

Preserve the existing layout proportions and good spacing.

Improve:
- alignment
- consistency
- button sizing
- visual hierarchy
- border treatment
- section separation

Avoid filling empty space just for the sake of filling it.

The result should feel intentionally spacious and professional.

==================================================
14. WHAT MUST NOT CHANGE
==================================================

DO NOT:
- rebuild the application from scratch
- remove existing functionality
- redesign the controls table
- remove the bottom status bar
- change the core Add Control concept
- create additional unnecessary screens
- add B5
- add B5-upper
- add B5-lower
- move B1/B2/B3/B4 to different physical locations
- use gradients
- use neon/glowing effects
- turn the UI into a gaming dashboard

==================================================
15. FINAL PRODUCT DIRECTION
==================================================

The final NexGlove UI should look like a real, professional desktop companion application for an intelligent wearable glove.

The visual message should immediately communicate:

NexGlove
AI/ML GESTURE CONTROL
Wearable Control. Limitless Possibilities.

The application should feel:
clean + technical + premium + modern + trustworthy.

Most importantly, the glove visualization must accurately represent the user's RIGHT-HAND PALM reference and the FOUR physical button positions:

B1 → under little finger
B2 → under ring finger
B3 → under middle finger
B4 → between index finger and thumb

Use the provided NexGlove logo and the provided palm reference image as the visual authorities.