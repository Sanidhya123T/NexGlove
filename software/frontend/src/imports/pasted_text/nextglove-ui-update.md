Modify the EXISTING NextGlove UI prototype. Do not rebuild the application from scratch.

IMPORTANT:
Keep the current overall visual design, layout, proportions, colors, robotic palm, B1-B5 button indicators, MY CONTROLS table, and bottom status bar.

Do NOT add a sidebar, navigation menu, charts, analytics, sensor graphs, extra dashboards, or additional screens.

The main purpose of this update is to make the control-mapping system logically correct and realistic.

==================================================
1. CONTROL MAPPING CONCEPT
==================================================

The application allows the user to assign a predefined computer action to a custom combination of physical glove buttons.

The basic logic is:

PHYSICAL BUTTON COMBINATION
        ↓
USER MAPPING
        ↓
SUPPORTED COMPUTER ACTION
        ↓
COMPUTER EXECUTES THE ACTION

Example:

B2 + B4
   ↓
Undo
   ↓
Ctrl + Z

The UI should clearly communicate that the user is configuring this mapping.

==================================================
2. EDIT CONTROL MODAL
==================================================

Update the existing "EDIT CONTROL" modal.

Use this structure:

EDIT CONTROL

Operation / Action
[ Undo                         ▼ ]

Action Type
[ Keyboard Shortcut            ]

Button Combination
[ B1 ] [ B2 ] [ B3 ] [ B4 ] [ B5 ]

Selected:
B2 + B4

Buttons:
Cancel     Save

The Operation / Action field must NOT be a free-text field.

It must be a dropdown/select field containing ONLY these supported actions:

Copy
Paste
Cut
Undo
Redo
Select All
Save
Alt + Tab
Ctrl + Shift + Esc
Type Text

When the user clicks the Operation / Action field, open a clean dropdown list.

The dropdown should behave like a normal form selection list:
- show all available actions
- user clicks one action
- the selected action appears in the field
- the dropdown closes immediately after selection
- do not permanently remove the selected option from the list
- the user can reopen the dropdown and change the selection

==================================================
3. ACTION TYPES
==================================================

The system should automatically determine the Action Type from the selected operation.

For example:

Copy → Keyboard Shortcut
Paste → Keyboard Shortcut
Cut → Keyboard Shortcut
Undo → Keyboard Shortcut
Redo → Keyboard Shortcut
Select All → Keyboard Shortcut
Save → Keyboard Shortcut
Alt + Tab → Keyboard Shortcut
Ctrl + Shift + Esc → Keyboard Shortcut
Type Text → Text Input

For normal keyboard actions, the user should NOT need to manually enter the keyboard shortcut.

The application already knows the mapping:

Copy → Ctrl + C
Paste → Ctrl + V
Cut → Ctrl + X
Undo → Ctrl + Z
Redo → Ctrl + Y
Select All → Ctrl + A
Save → Ctrl + S
Alt + Tab → Alt + Tab
Ctrl + Shift + Esc → Ctrl + Shift + Esc

Show this information subtly in the modal when appropriate.

For example:

Undo
Keyboard Shortcut
Ctrl + Z

==================================================
4. TYPE TEXT SPECIAL CASE
==================================================

If the user selects:

Type Text

then dynamically show an additional field:

Text
[ Hello Omkar                         ]

This field should NOT appear for Copy, Paste, Undo, etc.

Example:

Operation / Action
[ Type Text                    ▼ ]

Action Type
[ Text Input ]

Text
[ Hello Omkar ]

Button Combination
[ B1 ] [ B2 ] [ B3 ] [ B4 ] [ B5 ]

Selected:
B1 + B2 + B3

Cancel     Save

The user can enter any predefined text they want.

This represents a text-injection action into the currently focused text field.

Do not describe this as automatic password handling or password storage.

==================================================
5. BUTTON COMBINATION SELECTION
==================================================

The user must be able to select any supported combination of B1-B5.

Display five buttons:

[B1] [B2] [B3] [B4] [B5]

When a button is selected:
- change its appearance to the existing green active state
- clearly show which buttons are selected
- allow multiple buttons to be selected
- update the "Selected:" text below

Example:

[B1] [B2 ACTIVE] [B3] [B4 ACTIVE] [B5]

Selected:
B2 + B4

Keep the existing green visual language.

==================================================
6. ADD NEW CONTROL
==================================================

Update the existing "ADD NEW CONTROL" modal using the same logic.

Structure:

ADD NEW CONTROL

Operation / Action
[ Select an action              ▼ ]

Action Type
[ automatically determined ]

Only show:

Text
[                              ]

when "Type Text" is selected.

Button Combination
[B1] [B2] [B3] [B4] [B5]

Selected:
B1 + B3

Cancel     Save

The user must select an action from the predefined list.

Do not allow arbitrary unsupported actions to be entered.

==================================================
7. CONTROLS TABLE
==================================================

Keep the existing "MY CONTROLS" table.

Each row should display:

OPERATION / ACTION
BUTTON COMBINATION

Examples:

Right Click        B3
Scroll             B4
Copy               B1 + B2
Paste              B2 + B3
Cut                B1 + B3
Select All         B1 + B4
Undo               B2 + B4
Redo               B3 + B4
Save               B1 + B5
Type Text          B1 + B2 + B3

Each row must have Edit and Delete controls.

When Edit is clicked:
open the Edit Control modal with that row's current values.

When Delete is clicked:
remove that control from the table.

When Add Control is clicked:
open the Add New Control modal.

==================================================
8. VALIDATION
==================================================

Add basic validation.

Do not allow Save if:
- no operation has been selected
- no button has been selected

For Type Text:
- do not allow Save if the text field is empty

Also prevent duplicate button combinations if possible.

If a combination is already assigned to another action, show a simple message:

"This button combination is already assigned."

Keep the validation simple and understandable.

==================================================
9. PALM INTERACTION
==================================================

Keep the existing robotic palm design.

Keep B1-B5 positioned at the base/start of the fingers.

When the user clicks/taps a B button on the palm:
- visually highlight that button
- update the currently selected button combination in the control editor if the editor is open
- use the same green active color

Do not redesign the palm.

Do not make it realistic.
Do not make it cyberpunk.
Do not add technical sensor information.

==================================================
10. VISUAL DESIGN
==================================================

Preserve the existing visual identity:

- white background
- dark navy/black text
- subtle gray borders
- green accent
- clean robotic palm
- simple green button indicators
- minimal professional desktop application
- approximately 33% left / 67% right layout
- 16:9 laptop-first layout

The UI should feel like a real product configuration application, NOT an AI-generated dashboard.

Do not add:
- graphs
- charts
- analytics
- sensor values
- statistics
- unnecessary cards
- multiple pages
- navigation
- futuristic HUD
- excessive animations
- excessive gradients
- glowing effects

==================================================
11. IMPORTANT PRODUCT LOGIC
==================================================

The interface is a configuration layer.

The actual system logic is conceptually:

B2 + B4
    ↓
NextGlove mapping
    ↓
Undo
    ↓
Ctrl + Z
    ↓
Computer

For Type Text:

B1 + B2 + B3
    ↓
NextGlove mapping
    ↓
Type Text
    ↓
"Hello Omkar"
    ↓
Currently focused text field

Make the prototype demonstrate this concept clearly, but DO NOT implement real Bluetooth, ESP32 communication, Windows keyboard injection, backend, database, or authentication yet.

This is still a UI/functional prototype.

Do not change anything outside these requirements.