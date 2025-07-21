# JavaScript Assessment: Find Your Hat

[Codecademy](https://www.codecademy.com/projects/practice/find-your-hat)

## Table of Contents

- [JavaScript Assessment: Find Your Hat](#javascript-assessment-find-your-hat)
  - [Table of Contents](#table-of-contents)
  - [Repo Instructions](#repo-instructions)
  - [Project Goals](#project-goals)
  - [Project Requirements](#project-requirements)
    - [Game Rules:](#game-rules)
  - [JavaScript Assessment Rubric](#javascript-assessment-rubric)
    - [Thinking Process](#thinking-process)

---

## Repo Instructions

1. Clone the assessment repository, open it in your working directory, commit your progress accordingly, and push the repository to share it with the instructors.
2. Read the instructions in the `README.md` file.
3. Start the project:

   ```terminal
   npm install
   npm run dev
   ```

4. Edit `package.json` file by updating the `"author"` field with your Zoom name.
5. Edit **Thinking Process** section at the end of the `README.md` file. 👉 [Go to Thinking Process](#thinking-process)

[🔝 Back to Table of Contents](#table-of-contents)

---

## Project Goals

- In this project, you’ll be building an interactive terminal game.
- The scenario is that the player has lost their hat in a field full of holes, and they must navigate back to it without falling down one of the holes or stepping outside of the field.

[🔝 Back to Table of Contents](#table-of-contents)

## Project Requirements

- Your project is centered on a `Field` class.
- Give your `Field` class a `.print()` method that prints the current state of the field.

  > The Field constructor should take a two-dimensional array representing the “field” itself.
  >
  > A field consists of a grid containing “holes” (O) and one “hat” (^).
  >
  > We use a neutral background character (░) to indicate the rest of the field itself.
  >
  > The player will begin in the upper-left of the field, and the player’s path is represented by \*.

  ```js
  const myField = new Field([
  	["*", "░", "O"],
  	["░", "O", "░"],
  	["░", "^", "░"],
  ]);

  // Output:
  *░O
  ░O░
  ░^░

  ```

- Your game should be playable by users. In order to facilitate this, build out the following behavior:

  - When a user runs `main.js`, they should be prompted for input and be able to indicate which direction they’d like to `move`.
  - After entering an instruction, the user should see a printed result of their current field map with the tiles they have visited marked with the player's path. They should be prompted for their next move.

[🔝 Back to Table of Contents](#table-of-contents)

### Game Rules:

**1. Wins by finding their hat.**

**2. Loses by landing on (and falling in) a hole.**

**3. Loses by attempting to move “outside” the field.**

**When any of the above occur, let the user know and end the game.**

[🔝 Back to Table of Contents](#table-of-contents)

---

## JavaScript Assessment Rubric

1. Class Method ที่ควรมีครบ: (2 pts ครบถ้วน | 1 pts มีไม่ครบ | 0 pts ไม่มีเลย)

- constructor
- moveRight
- moveLeft
- moveUp
- moveDown

2. Print Map (2 pts ครบถ้วน | 1 pts มีไม่ครบ | 0 pts ไม่มีเลย)

3. เดินได้ถูกต้อง & Update Map ได้ถูกต้อง (2 pts ครบถ้วน | 1 pts มีไม่ครบ | 0 pts ไม่มีเลย)

- เลี้ยวซ้าย
- เลี้ยวขวา
- ขึ้น
- ลง

4. Game Logic: (2 pts ครบถ้วน | 1 pts มีไม่ครบ | 0 pts ไม่มีเลย)

- Wins by finding their hat
- Loses by landing on (and falling in) a hole.
- Attempts to move "outside" the field. (Warning message when actor attempts to move outside)

5. มี Random ตำแหน่ง: (2 pts ครบถ้วน | 1 pts มีไม่ครบ | 0 pts ไม่มีเลย)

- holes
- hat
- actor

6. Thinking process & Breakdown the steps of a thinking process (5 pts ครบถ้วน | 3 pts มีไม่ครบ | 0 pts ไม่มีเลย)

[🔝 Back to Table of Contents](#table-of-contents)

---

**Please Write Down Your Thinking Process Below:**

---

### Thinking Process
#### Designing process

1. แบ่งการพัฒนา Code เป็น 3 part ดังนี้
  - part1 : เน้นที่ระบบการทำงานหลักของเกม การเคลื่อนที่ (เฉพาะในส่วนของ Move), การตกขอบ, การจบเกม, ระบบหลักในการรันเกม
  - part2 : เพิ่มระบบ level selection, ระบบ map selection, และ Jumping mechanism
  - part3 : ทำระบบ Enemy
  จาก requirements จะเห็นว่า แค่ part 1 และ 2 ระบบ map selection ก็เพียงพอแล้ว
#### Part 1
2. ในการพัฒนา part 1 จะเริ่มจาก logic การเดิน โดยเป็นการ update variables positionRow และ positionCol ผ่าน method moveUp(), moveDown(), moveLeft(), moveRight()
3. สร้าง method clearTile() เพื่อลบรอยการเดิน และ markTile() เพื่อแสดงตำแหน่งใหม่ที่ผู้เล่นอยู่
4. สร้าง method checkBoundary() เพื่อตรวจสอบว่า ผู้เล่นตกออกจากสนามหรือไม่ หากตกจะทำให้เกมจบ โดยช่วงแรกพบว่ามี bug เดินขึ้นบนหรือไปซ้ายจากจุด [0][0] จึงมีการแก้ไข logic การเช็คใหม่ จากเดิมคือเช็คว่าผู่เล่นออกจากสนามหรือยัง ให้เป็นการเช็คให้ผู้เล่นต้องอยู่บนสนามตลอดเวลา
5. สร้าง method checkGameOver() โดยจะมีการเรียกใช้ getCurrentTile() เพื่อดูว่าตำแหน่งที่ผู้เล่นจะเดินไป เป็นที่หลุมหรือหมวก โดยถ้าเป็นหลุมหรือหมวกจะคืนค่า string ซึ่งจะไปใช้ในการเช็คใน logic การจบเกม
6. สร้าง core method ชื่อ startGame() เพื่อรันการทำงานหลักของเกม โดยจะมีการรับ input เป็น W,A,S,D โดยใช้ switch case เพื่อแยก logic การเคลื่อนที่ว่าผู้เล่นจะเคลื่อนที่ไปในทิศทางใด และยังมีการเพิ่ม X เพื่อออกเกม
<br> ในการรันเกม จะมีการใช้ while loop เพื่อให้มีการทำงานต่อเนื่อง และใช้ break เมื่อมีผลทำให้เกมต้องหยุดไม่ว่าจะ ชนะ, ตกหลุม, ตกขอบ โดยจะมีการเช็คว่าตำแหน่งใหม่ที่เดินไปผ่าน checkBoundary(), checkGameOver()
<br> การ render ภาพจะมีการใช้ method clearTile(), markTile(), print()

7. ยังไม่มีการแก้ไข constructor() สำหรับ part นี้

#### Part 2
8. มีการเพิ่ม Jumping mechanic เข้ามา เพื่อความท้ายทายจึงให้มีการจำกัดจำนวนการโดดตาม level ที่เลือก โดยระบบนี้จะเรียกใช้โดยการใส่ input "J + ${direction}" เช่น จะโดนลงล่างให้พิมพ์ "JS" การกระโดดจะทำให้ผู้เล่นสามารถเดินได้ 2 ช่อง หาก jumpsRemaining หมดจะไม่สามารถกระโดดได้อีก
9. เพิ่มระบบ level selection เข้ามา โดยจะถามผู้เล่นผ่าน input prompt ว่าจะเลือกระดับใด โดยแต่ละระดับจะมีผลต่อการจำกัดจำนวนครั้งในการโดดและขนาดแผนที่ ที่ต่างกันไป
<br> Level selection จะเรียกใช้ผ่านการทำงานของ menu() ซึ่งจะให้ผู้เล่นเลือกระดับความยากและเลือกว่าจะใช้แผนที่ที่สร้างมาแล้วหรือแผนที่แบบสุ่ม
10. ระบบ Map selection จะมีการเรียกใช้ method ตามที่ผู้เล่นเลือกตัวเลือกนี้จากหน้า menu
- getPreMadeMap() เรียกแมพที่สร้างไว้แล้วมา โดยผู้เล่นจะเริ่มที่ [0][0] เสมอ
- generateField คือจะสร้าง map จากการสุ่มด้วย Math.random() โดยจะสุ่มทั้ง ตำแหน่งผู้เล่น, หลุม, หมวก
11. เพื่อให้ method generateField สามารถทำงานได้ จึงต้องมีการ modified constructor() เพื่อให้รับค่าเริ่มต้นของผู้เล่นด้วย และ print() มีการปรับให้ตรวจสอบตำแหน่งผู้เล่นก่อนที่จะ render
12. ใน menu() หากผู้เล่นเลือกตัวเลือกครบแล้วจะนำไปสู่ core mechanic โดยสร้าง instant game และมีการเรียก game.startGame()

#### Part 3
- เพิ่มโหมดใหม่ NIGHTMARE
- เพิ่มศัตรู 'X' ที่คอยไล่ในโหมด Hard และ NIGHTMARE
- จัด functions/methods ใหม่ เพื่อแยกการทำงานเฉพาะออกมา

_Notes:_<br>
_- You can attach flowcharts, diagrams, and images as needed._<br>
_- The purpose of this section is not to explain your code but rather to convey your thoughts and ideas._

[🔝 Back to Table of Contents](#table-of-contents)
