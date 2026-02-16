# PATENT DRAWING INSTRUCTIONS FOR ILLUSTRATOR

## General Requirements (USPTO Rules)

All drawings must comply with **37 CFR 1.84** (USPTO drawing standards):

- **Medium:** Black ink on white paper, or computer-generated equivalent
- **Paper size:** US letter (8.5" x 11") or A4 (21.0 cm x 29.7 cm)
- **Margins:** Top: 2.5 cm, Left: 2.5 cm, Right: 1.5 cm, Bottom: 1.0 cm
- **Usable drawing area:** Approximately 17.0 cm x 26.2 cm on US letter
- **Line weight:** All lines must be solid black, sufficiently dense and dark, uniformly thick and well-defined. Minimum line weight: 0.3 mm
- **Numbering:** Each figure must be labeled "FIG. 1", "FIG. 2", etc. in Arabic numerals, centered below the drawing
- **Reference numerals:** Use Arabic numerals (100, 102, 104, etc.) with lead lines pointing to the referenced element. The same element must use the same numeral across all figures. Numerals should not be placed on hatched or shaded areas. Group related elements in the same hundred series (e.g., 100-series for system architecture, 200-series for motion stack, etc.)
- **Text in drawings:** Use lettering at least 0.32 cm (1/8 inch) high. Use consistent font throughout. All text must be in English
- **Shading:** Use hatching or stippling for cross-sections. Use light shading for surfaces when needed for clarity. Do NOT use solid black fills for large areas
- **Arrows:** Use open arrowheads for data flow and solid arrowheads for control flow
- **No color:** All drawings must be in black and white only (no grayscale fills except light shading for clarity)
- **Orientation:** Figures should be oriented to be read from the top or right side of the page

---

## REFERENCE NUMERAL MASTER LIST

Use the following reference numerals consistently across ALL figures:

### 100-Series: System Architecture
| Numeral | Element |
|---------|---------|
| 100 | System (overall) |
| 102 | Cloud-Based Real-Time Database |
| 104 | Network / Internet |
| 106 | Chair Computing Device (smartphone/tablet icon) |
| 108 | Member Computing Device #1 |
| 110 | Member Computing Device #2 |
| 112 | Member Computing Device #N |
| 114 | Client Application |
| 116 | Presentation Layer |
| 118 | Business Logic Layer |
| 120 | Engine Layer |
| 122 | Motion Stack Engine |
| 124 | In-Order Check Engine (Motion Availability Engine) |
| 126 | Debate Engine |
| 128 | Vote Engine |
| 130 | Pending Requests Engine |
| 132 | Quorum Engine |
| 134 | State Management Layer |
| 136 | Meeting State Manager |
| 138 | Session Persistence (Local Storage) |
| 140 | Services Layer |
| 142 | Meeting Connection Service |
| 144 | Minutes Export Service |
| 146 | Data Layer |
| 148 | Rules Database |
| 150 | Processor |
| 152 | Memory |
| 154 | Network Interface |

### 200-Series: Motion Stack
| Numeral | Element |
|---------|---------|
| 200 | Motion Stack (overall LIFO structure) |
| 202 | Motion Entry (generic) |
| 204 | Motion Entry - Main Motion (bottom of stack) |
| 206 | Motion Entry - Amendment, Degree 1 |
| 208 | Motion Entry - Amendment, Degree 2 |
| 210 | Motion Entry - Subsidiary Motion |
| 212 | Motion Entry - Privileged Motion |
| 214 | Motion Type Identifier field |
| 216 | Precedence Rank field |
| 218 | Lifecycle Status field |
| 220 | Vote Tally sub-structure (aye/nay/abstain) |
| 222 | Voted-By list |
| 224 | Speaking State sub-structure |
| 226 | Current Speaker field |
| 228 | Speaking Queue field |
| 230 | Speaking History field |
| 232 | Rules Profile sub-structure |
| 234 | Mover field |
| 236 | Seconder field |
| 238 | Motion Text field |
| 240 | Degree field |
| 242 | Saved Speaking State record |
| 244 | Stack Top pointer |
| 246 | Push operation arrow |
| 248 | Pop operation arrow |

### 300-Series: Motion Lifecycle
| Numeral | Element |
|---------|---------|
| 300 | PENDING_CHAIR state |
| 302 | PENDING_SECOND state |
| 304 | DEBATING state |
| 306 | VOTING state |
| 308 | DECIDED state (terminal) |
| 310 | ADOPTED result |
| 312 | DEFEATED result |
| 314 | WITHDRAWN result |
| 316 | TABLED result |
| 318 | POSTPONED result |
| 320 | COMMITTED result |
| 322 | Transition: Chair recognizes motion |
| 324 | Transition: Member seconds |
| 326 | Transition: Debate closes / Chair calls vote |
| 328 | Transition: Votes tallied |
| 330 | Transition: No second required (bypass) |

### 400-Series: Precedence & Validation
| Numeral | Element |
|---------|---------|
| 400 | Precedence Validation Algorithm (overall) |
| 402 | Decision: Is stack empty? |
| 404 | Decision: Is new motion a Main motion? |
| 406 | Decision: Is new motion Subsidiary? |
| 408 | Decision: Is new motion Privileged? |
| 410 | Decision: Is new motion Incidental? |
| 412 | Decision: Does new motion outrank top? |
| 414 | Decision: Is top motion in DEBATING status? |
| 416 | Decision: Is amendment degree < 2? |
| 418 | Result: PERMIT - Push onto stack |
| 420 | Result: REJECT - Return error with reason |
| 422 | Action: Route to Pending Requests Queue |
| 424 | Input: New Motion Request |
| 426 | Input: Current Stack State |

### 500-Series: Dual-Track Architecture
| Numeral | Element |
|---------|---------|
| 500 | Incoming Parliamentary Action |
| 502 | Category Router |
| 504 | Track 1: Motion Stack (LIFO) |
| 506 | Track 2: Pending Requests Queue (FIFO) |
| 508 | Precedence Validation Gate |
| 510 | Interruptibility Check |
| 512 | Chair Notification |
| 514 | Chair Resolution Interface |
| 516 | Request Entry |
| 518 | Main Motion category label |
| 520 | Subsidiary Motion category label |
| 522 | Privileged Motion category label |
| 524 | Bring-Back Motion category label |
| 526 | Incidental Motion category label |
| 528 | Point of Order request |
| 530 | Parliamentary Inquiry request |
| 532 | Request for Information request |
| 534 | Appeal request |
| 536 | Division of Assembly request |
| 538 | Suspend the Rules request |
| 540 | Withdraw Motion request |
| 542 | Objection to Consideration request |

### 600-Series: Speaking Queue
| Numeral | Element |
|---------|---------|
| 600 | Speaking Queue (overall) |
| 602 | Speaker Entry |
| 604 | Participant Identifier field |
| 606 | Request Timestamp field |
| 608 | Stance Indicator field (FOR/AGAINST/NEUTRAL) |
| 610 | Speaking History Count field |
| 612 | Tier 0: Mover (highest priority) |
| 614 | Tier 1: First-Time Speakers |
| 616 | Tier 2: Repeat Speakers |
| 618 | Step: Extract Mover |
| 620 | Step: Partition by Speaking History |
| 622 | Step: Stance Alternation Sort |
| 624 | Step: Recency-Based Ordering |
| 626 | PRO speaker indicator |
| 628 | CON speaker indicator |
| 630 | NEUTRAL speaker indicator |
| 632 | Sorted Output Queue |
| 634 | Debate Constraints data structure |
| 636 | Max Speeches Per Member value |
| 638 | Time Limit Per Speech value |
| 640 | Debate Closed flag |

### 700-Series: Effect-of-Adoption
| Numeral | Element |
|---------|---------|
| 700 | Motion Disposition event |
| 702 | Decision: Adopted or Defeated? |
| 704 | Effect: Modify parent motion text (Amendment) |
| 706 | Effect: Close debate, transition to VOTING (Previous Question) |
| 708 | Effect: Archive stack to Tabled Motions (Lay on Table) |
| 710 | Effect: Save to Postponed Motions (Postpone Definitely) |
| 712 | Effect: Kill motion (Postpone Indefinitely) |
| 714 | Effect: Route to committee (Commit/Refer) |
| 716 | Effect: Transition to ADJOURNED (Adjourn) |
| 718 | Effect: Transition to RECESS (Recess) |
| 720 | Effect: Enter SUSPENDED_RULES (Suspend Rules) |
| 722 | Effect: Restore from Tabled Motions (Take from Table) |
| 724 | Effect: Return to debate (Reconsider) |
| 726 | Effect: Modify/repeal resolution (Rescind) |
| 728 | Action: Pop motion from stack |
| 730 | Action: Record in Decided Motions history |
| 732 | Action: Restore Speaking State |
| 734 | Tabled Motions Repository |
| 736 | Decided Motions History |
| 738 | Postponed Motions Repository |

### 800-Series: Motion Availability
| Numeral | Element |
|---------|---------|
| 800 | Motion Availability Evaluation (overall) |
| 802 | Input: Meeting State |
| 804 | Input: Motion Stack Contents |
| 806 | Input: Participant Role |
| 808 | Input: Current Meeting Stage |
| 810 | Check: Meeting Stage appropriate? |
| 812 | Check: Stack state permits motion? |
| 814 | Check: Precedence sufficient? |
| 816 | Check: Amendment degree within limit? |
| 818 | Check: Role permits action? |
| 820 | Check: Special conditions met? |
| 822 | Output: Available = TRUE, reason = "In order" |
| 824 | Output: Available = FALSE, reason = "[explanation]" |
| 826 | UI: Enabled button (active) |
| 828 | UI: Disabled button with tooltip |

### 900-Series: State Synchronization & Meeting Stages
| Numeral | Element |
|---------|---------|
| 900 | Versioned State Object |
| 902 | Version Number field |
| 904 | Broadcast operation |
| 906 | State Migration Function |
| 908 | Session Storage (local) |
| 910 | Heartbeat Signal |
| 912 | Reconnection / State Comparison |
| 920 | NOT_STARTED stage |
| 922 | CALL_TO_ORDER stage |
| 924 | ROLL_CALL stage |
| 926 | APPROVE_MINUTES stage |
| 928 | REPORTS stage |
| 930 | UNFINISHED_BUSINESS stage |
| 932 | NEW_BUSINESS stage |
| 934 | MOTION_DISCUSSION stage |
| 936 | VOTING stage |
| 938 | RECESS stage |
| 940 | SUSPENDED_RULES stage |
| 942 | ADJOURNED stage |

### 1000-Series: Vote Engine
| Numeral | Element |
|---------|---------|
| 1000 | Vote Engine (overall) |
| 1002 | Input: Vote Tally (Ayes, Nays, Abstentions) |
| 1004 | Step: Compute Total Votes Cast (Ayes + Nays) |
| 1006 | Decision: Which threshold type? |
| 1008 | Branch: MAJORITY (ayes > total/2) |
| 1010 | Branch: TWO_THIRDS (ayes >= total * 2/3) |
| 1012 | Branch: TIE_SUSTAINS_CHAIR (ayes > nays) |
| 1014 | Branch: NONE (auto-adopt) |
| 1016 | Result: ADOPTED |
| 1018 | Result: DEFEATED |
| 1020 | Action: Trigger Effect-of-Adoption |

### 1100-Series: User Interface
| Numeral | Element |
|---------|---------|
| 1100 | Chair View (overall screen) |
| 1102 | Meeting Stage Banner |
| 1104 | Motion Stack Display panel |
| 1106 | Action Buttons panel (Chair) |
| 1108 | Voting Controls |
| 1110 | Speaking Queue panel |
| 1112 | Pending Requests panel |
| 1114 | Participant List |
| 1116 | Meeting Log |
| 1120 | Member View (overall screen) |
| 1122 | Action Buttons panel (Member - fewer options) |
| 1124 | Vote Buttons (Aye/Nay/Abstain) |
| 1126 | Request to Speak button |
| 1128 | Raise Incidental Motion button |
| 1130 | Disabled motion button with tooltip |

---

## FIGURE-BY-FIGURE INSTRUCTIONS

---

### FIG. 1 -- System Architecture Overview Diagram

**Purpose:** Shows the overall system architecture -- how participant devices connect to the cloud database and what the client application comprises internally. This is the primary figure that gives the patent examiner a high-level understanding of the invention.

**Layout:** Landscape orientation recommended. Divide the page into three horizontal zones.

**Top Zone -- Participant Devices:**
- Draw four device icons arranged in a horizontal row across the top of the page
  - Leftmost device (106): Draw a tablet/smartphone outline. Label it "CHAIR DEVICE" with numeral 106
  - Second device (108): Draw a smartphone outline. Label "MEMBER DEVICE #1" with numeral 108
  - Third device (110): Draw a laptop outline. Label "MEMBER DEVICE #2" with numeral 110
  - Fourth device (112): Draw a desktop computer outline. Label "MEMBER DEVICE #N" with numeral 112. Use an ellipsis (...) between device 110 and 112 to indicate additional devices
- Each device icon should contain a small label "CLIENT APP (114)" inside it

**Middle Zone -- Network & Cloud:**
- Draw a cloud shape (102) centered below the devices. Label it "CLOUD-BASED REAL-TIME DATABASE 102"
- Draw a horizontal dashed line or wavy line (104) between the devices and the cloud, labeled "NETWORK 104"
- Draw double-headed arrows from each device down through the network line to the cloud, indicating bidirectional real-time communication

**Bottom Zone -- Client Application Internal Architecture:**
- Below the cloud, draw a large rectangle representing the Client Application (114). This shows what runs inside each device. Label it "CLIENT APPLICATION 114"
- Inside this rectangle, draw four stacked horizontal sub-rectangles, one for each layer:

  **Sub-rectangle 1 (top) -- Presentation Layer (116):**
  - Label: "PRESENTATION LAYER 116"
  - Inside, draw small boxes for: "Meeting View", "Action Buttons", "Motion Stack Display", "Voting UI", "Speaking Queue UI", "Modal Dialogs"

  **Sub-rectangle 2 -- Business Logic Layer (118):**
  - Label: "BUSINESS LOGIC / ENGINE LAYER 118, 120"
  - Inside, draw six small boxes in a row:
    - "Motion Stack Engine 122"
    - "In-Order Check Engine 124"
    - "Debate Engine 126"
    - "Vote Engine 128"
    - "Pending Requests Engine 130"
    - "Quorum Engine 132"

  **Sub-rectangle 3 -- State Management Layer (134):**
  - Label: "STATE MANAGEMENT LAYER 134"
  - Inside, draw boxes for: "Meeting State Manager 136", "Session Persistence 138"

  **Sub-rectangle 4 (bottom) -- Services & Data Layer (140, 146):**
  - Label: "SERVICES & DATA LAYER 140, 146"
  - Inside, draw boxes for: "Meeting Connection Service 142", "Minutes Export Service 144", "Rules Database 148"

- Draw downward arrows between layers to show data flow
- Draw a double-headed arrow from "Meeting Connection Service 142" upward through the layers and out of the rectangle, connecting to the cloud (102) above, to show the real-time sync path
- At the bottom right corner of the Client Application rectangle, draw a small box labeled "PROCESSOR 150, MEMORY 152, NETWORK INTERFACE 154"

---

### FIG. 2 -- Motion Stack Data Structure Diagram

**Purpose:** Shows the LIFO stack data structure in detail, with example motion entries and their internal field structure. This is critical for Claims 1, 7, and 13.

**Layout:** Portrait orientation. Two parts: left side shows the stack visually, right side shows a single motion entry's internal structure in detail.

**Left Side -- Stack Visualization (200):**
- Draw a tall vertical rectangle open at the top to represent the stack, labeled "MOTION STACK 200 (LIFO)"
- Draw a small upward-pointing arrow at the top labeled "Stack Top 244"
- Inside the rectangle, draw four horizontal sections stacked vertically, each representing a motion entry. Use light shading to alternate sections for visual clarity:

  **Top section (closest to opening):** "AMENDMENT (Deg. 2) 208"
  - Show: "Precedence: 2 | Status: DEBATING | Degree: 2"
  - Small arrow on the left labeled "PUSH 246" pointing into the stack
  - Small arrow on the right labeled "POP 248" pointing out of the stack

  **Second section:** "AMENDMENT (Deg. 1) 206"
  - Show: "Precedence: 2 | Status: DEBATING | Degree: 1"
  - Show: "Saved Speaking State 242" with a small dashed box

  **Third section:** "PREVIOUS QUESTION 210"
  - Show: "Precedence: 6 | Status: PENDING_SECOND"
  - (Note: This example shows a stack configuration that would NOT actually be valid since Previous Question outranks Amendment -- use a valid example instead)

  **CORRECTED third section:** Leave only 3 entries for clarity. Use:
  - Top: "AMENDMENT (Deg. 1) 206" -- Precedence: 2 | Status: DEBATING | Degree: 1
  - Middle: (empty, or show space)
  - Bottom: "MAIN MOTION 204" -- Precedence: N/A | Status: DEBATING | Degree: 0

  Actually, use this valid 3-entry example:
  - **Top (Deg. 2 Amendment) 208:** Type: AMEND | Prec: 2 | Status: DEBATING | Degree: 2
  - **Middle (Deg. 1 Amendment) 206:** Type: AMEND | Prec: 2 | Status: DEBATING | Degree: 1 | Contains "Saved Speaking State 242"
  - **Bottom (Main Motion) 204:** Type: MAIN | Prec: -- | Status: DEBATING | Degree: 0 | Contains "Saved Speaking State 242"

- Below the stack, draw a label: "Bottom = Main Motion (oldest), Top = Immediately Pending Question (newest)"
- Draw arrows showing push goes to top, pop removes from top

**Right Side -- Motion Entry Detail (202):**
- Draw a large rectangle labeled "MOTION ENTRY 202 (Structured Data Record)"
- Inside, draw labeled horizontal rows (like a database record), each with the field name on the left and an example value on the right:

| Field | Example Value |
|-------|---------------|
| id (unique identifier) | "motion_3" |
| motionType 214 | AMEND |
| text 238 | "Strike 'annual' and insert 'quarterly'" |
| mover 234 | "J. Smith" |
| seconder 236 | "A. Jones" |
| status 218 | DEBATING |
| degree 240 | 1 |
| precedence 216 | 2 |
| voteRequired | MAJORITY |

- Below this, draw a sub-box labeled "VOTE TALLY 220":
  - aye: 0, nay: 0, abstain: 0
  - votedBy 222: [ ]

- Below that, draw a sub-box labeled "SPEAKING STATE 224":
  - currentSpeaker 226: "M. Johnson"
  - speakingQueue 228: ["R. Lee (FOR)", "P. Davis (AGAINST)"]
  - speakingHistory 230: ["J. Smith: 1 speech", "M. Johnson: 1 speech"]

- Below that, draw a sub-box labeled "RULES PROFILE 232":
  - isDebatable: true
  - isAmendable: true
  - requiresSecond: true
  - category: SUBSIDIARY

- Below that, draw a dashed sub-box labeled "SAVED SPEAKING STATE 242 (when interrupted)":
  - "(Serialized copy of Speaking State from parent motion)"

---

### FIG. 3 -- Motion Lifecycle State Diagram

**Purpose:** Shows the state machine for a single motion entry's lifecycle. Corresponds to Claim 1(f).

**Layout:** Landscape orientation. State machine / bubble diagram.

**Draw the following state bubbles (circles or rounded rectangles) arranged left-to-right across the page:**

1. **PENDING_CHAIR (300)** -- Draw as a rounded rectangle. Label inside: "PENDING_CHAIR 300". This is the start state. Draw a small filled circle with an arrow pointing to this state to indicate "Start"

2. **PENDING_SECOND (302)** -- Rounded rectangle. Label: "PENDING_SECOND 302". Position to the right of 300

3. **DEBATING (304)** -- Rounded rectangle, slightly larger than others to indicate it's a key state. Label: "DEBATING 304". Position to the right of 302

4. **VOTING (306)** -- Rounded rectangle. Label: "VOTING 306". Position to the right of 304

5. **DECIDED (308)** -- Rounded rectangle with double border (indicating terminal state). Label: "DECIDED 308". Position to the right of 306

**Draw the following transition arrows:**

- 300 --> 302: Arrow labeled "Chair recognizes motion 322"
- 302 --> 304: Arrow labeled "Member seconds motion 324"
- 300 --> 304: Curved arrow bypassing 302, labeled "No second required 330" (dashed line to indicate conditional bypass). This path applies to motions where requiresSecond = false
- 304 --> 306: Arrow labeled "Chair calls the vote / Debate closes 326"
- 306 --> 308: Arrow labeled "Votes tallied, result determined 328"

**Inside or next to the DECIDED state (308), draw two small sub-states or result labels:**
- "ADOPTED 310"
- "DEFEATED 312"

**Draw additional terminal result labels branching from state 308 (or as annotations):**
- "WITHDRAWN 314"
- "TABLED 316"
- "POSTPONED 318"
- "COMMITTED 320"

**Draw an annotation box** to the side of DEBATING (304) noting: "Speaking state preserved here when interrupted by higher-precedence motion (see FIG. 2, element 242)"

---

### FIG. 4 -- Precedence Validation Flowchart

**Purpose:** Shows the algorithm executed when a new motion request is received. This is the core of Claim 1(c)-(e).

**Layout:** Portrait orientation. Standard flowchart with rounded-rectangle start/end, diamond decision blocks, and rectangle process blocks.

**Start (top of page):**
- Rounded rectangle: "Receive New Motion Request 424"
- Arrow down to first decision

**Decision 1 (402):**
- Diamond: "Is motion stack empty? 402"
- YES branch (left or right):
  - Decision 1a (404): Diamond: "Is new motion a Main motion? 404"
    - YES: Rectangle: "PERMIT -- Push onto stack 418" (green-tinted or double-bordered to indicate success). Draw arrow to end
    - NO: Decision 1b (408): Diamond: "Is new motion Privileged AND can be made without pending question? 408"
      - YES: Go to PERMIT 418
      - NO: Rectangle: "REJECT -- 'No main motion is pending' 420" (draw with X mark or single-bordered to indicate failure). Draw arrow to end

- NO branch (stack is not empty -- continue down):

**Decision 2 (410):**
- Diamond: "Is new motion Incidental? 410"
- YES: Rectangle: "Route to Pending Requests Queue 422" (see FIG. 5). Draw arrow to end
- NO: Continue down

**Decision 3 (406):**
- Diamond: "Is new motion Subsidiary? 406"
- YES branch:
  - Decision 3a (414): Diamond: "Is top motion in DEBATING status? 414"
    - NO: "REJECT -- 'Current motion is not in a debatable state' 420". Arrow to end
    - YES: Continue
  - Decision 3b: Diamond: "Is new motion an Amendment? (AMEND type)"
    - YES: Decision 3b-i (416): Diamond: "Is amendment degree < 2? 416"
      - NO: "REJECT -- 'Cannot exceed two degrees of amendment' 420". Arrow to end
      - YES: "PERMIT -- Push onto stack 418". Arrow to end
    - NO: Decision 3c (412): Diamond: "Does new motion's precedence rank > top motion's precedence rank? 412"
      - NO: "REJECT -- 'Motion does not have sufficient precedence' 420". Arrow to end
      - YES: "PERMIT -- Push onto stack 418". Arrow to end

- NO branch from Decision 3 (not subsidiary):

**Decision 4 (408):**
- Diamond: "Is new motion Privileged? 408"
- YES: Decision 4a (412): Diamond: "Does new motion outrank top? 412"
  - YES: "PERMIT -- Push onto stack 418"
  - NO: "REJECT -- 'Insufficient precedence' 420"
- NO: "REJECT -- 'Cannot make this motion while another is pending' 420"

**End (bottom of page):**
- Rounded rectangle: "Return result to requesting device"

**Note:** At each REJECT box, include in parentheses that the human-readable reason string is transmitted back to the requesting device.

---

### FIG. 5 -- Dual-Track Motion Processing Diagram

**Purpose:** Shows the two parallel processing tracks and the routing logic between them. This is the core of Claim 7.

**Layout:** Landscape orientation. Three-column layout.

**Left Column -- Input:**
- Draw a large arrow or funnel at the top left labeled "INCOMING PARLIAMENTARY ACTION 500"
- Below it, list the five categories of actions in a column of small labeled boxes:
  - "Main Motions 518"
  - "Subsidiary Motions 520"
  - "Privileged Motions 522"
  - "Bring-Back Motions 524"
  - "Incidental Motions 526"

**Center Column -- Category Router:**
- Draw a large diamond or hexagonal shape in the center labeled "CATEGORY ROUTER 502"
- Draw arrows from each of the five category boxes into the router
- From the router, draw TWO output paths:

**Right Column -- Two Tracks:**

**Track 1 (top right):**
- Draw a tall rectangle on the upper right labeled "TRACK 1: MOTION STACK (LIFO) 504"
- Draw an arrow from the router to Track 1, with a label on the arrow: "Main, Subsidiary, Privileged, Bring-Back"
- Inside Track 1, draw:
  - A small gate/barrier icon labeled "PRECEDENCE VALIDATION GATE 508"
  - Below the gate, a simplified stack diagram (3 horizontal bars representing motion entries stacked vertically)
  - Two output arrows from the gate: one going through (labeled "VALID -- Push") and one bouncing back (labeled "INVALID -- Reject with reason")
- Below Track 1, draw small boxes listing the motion types routed here:
  - Main Motion, Amend, Postpone Indefinitely, Commit, Postpone Definitely, Limit Debate, Previous Question, Lay on Table, Orders of Day, Question of Privilege, Recess, Adjourn, Fix Time to Adjourn, Take from Table, Reconsider, Rescind

**Track 2 (bottom right):**
- Draw a wide horizontal rectangle on the lower right labeled "TRACK 2: PENDING REQUESTS QUEUE (FIFO) 506"
- Draw an arrow from the router to Track 2, with a label on the arrow: "Incidental Motions"
- Inside Track 2, draw:
  - A small check icon labeled "INTERRUPTIBILITY CHECK 510"
  - A horizontal queue diagram (boxes arranged left-to-right, with "IN" on the left and "OUT" on the right)
  - An arrow from the queue's OUT side pointing to a box labeled "CHAIR RESOLUTION INTERFACE 514"
  - A notification icon or bell labeled "CHAIR NOTIFICATION 512"
- Below Track 2, draw small boxes listing the request types routed here:
  - Point of Order 528, Parliamentary Inquiry 530, Request for Information 532, Appeal 534, Division of Assembly 536, Suspend Rules 538, Withdraw Motion 540, Objection to Consideration 542
- Next to each request type, draw a small flag: "canInterrupt: YES" or "canInterrupt: NO"

**Between the two tracks:**
- Draw a bold dashed vertical line separating Track 1 and Track 2, with a label: "STRUCTURALLY SEPARATE DATA STRUCTURES"

**At the bottom of the page:**
- Draw arrows from both Track 1 and Track 2 converging into a single box labeled "BROADCAST UPDATED STATE TO ALL DEVICES 904"

---

### FIG. 6 -- Speaking Queue Prioritization Algorithm Flowchart

**Purpose:** Shows the multi-factor sorting algorithm for the speaking queue. This is the core of Claim 5.

**Layout:** Portrait orientation. Flowchart style with data visualizations showing the queue at each step.

**Start:**
- Rounded rectangle: "Speaking Queue Reorder Triggered"
- Below, draw the input: a horizontal row of boxes representing unsorted speaker entries in the queue. Each box should contain a name, stance (F/A/N), and speaking count. Example:

  | R. Lee (A) 1x | J. Smith (F) 0x | P. Davis (A) 0x | K. Brown (F) 1x | T. Wilson (N) 0x | A. Jones (F) 0x |

  Label this row: "INPUT: Unsorted Speaking Queue 600"
  Note: "(A) = Against, (F) = For, (N) = Neutral, 0x = never spoken, 1x = spoken once"

**Step 1 -- Extract Mover (618):**
- Rectangle: "Step 1: Extract Mover 618"
- "Is mover (J. Smith) in queue AND has not yet spoken (0x)?"
- Arrow labeled YES: "Place at Position 0 (Tier 0) 612"
- Show the mover being removed from the main queue and placed at the front of a new "SORTED OUTPUT" row
- Show output: | **J. Smith (F) 0x** | ... remaining unsorted ... |

**Step 2 -- Partition by Speaking History (620):**
- Rectangle: "Step 2: Partition Remaining by Speaking History 620"
- Draw two separate boxes:
  - "FIRST-TIME SPEAKERS (Tier 1) 614": | P. Davis (A) 0x | T. Wilson (N) 0x | A. Jones (F) 0x |
  - "REPEAT SPEAKERS (Tier 2) 616": | R. Lee (A) 1x | K. Brown (F) 1x |

**Step 3 -- Stance Alternation Sort (622):**
- Rectangle: "Step 3: Stance Alternation Sort (within each tier) 622"
- Show the process for Tier 1:
  - Separate into: PRO 626 = [A. Jones], CON 628 = [P. Davis], NEUTRAL 630 = [T. Wilson]
  - Interleave: take one PRO, one CON, one NEUTRAL in rotation
  - Result: | A. Jones (F) | P. Davis (A) | T. Wilson (N) |
- Show the process for Tier 2:
  - Separate into: PRO = [K. Brown], CON = [R. Lee]
  - Interleave: | K. Brown (F) | R. Lee (A) |

**Step 4 -- Recency-Based Ordering (624):**
- Rectangle: "Step 4: Within each stance subgroup, sort by time since last speaking (longest wait first), then by request timestamp (earliest first) 624"
- Show annotation: "In this example, groups are small enough that recency ordering doesn't change the sequence"

**Final Output (632):**
- Rectangle: "SORTED OUTPUT QUEUE 632"
- Draw the final ordered queue as a horizontal row:

  | **J. Smith (F)** | A. Jones (F) | P. Davis (A) | T. Wilson (N) | K. Brown (F) | R. Lee (A) |
  | Tier 0: Mover | <-- Tier 1: First-Time Speakers --> | <-- Tier 2: Repeat Speakers --> |

- Use brackets or braces underneath to show the tier groupings
- Label: "Transmitted to all connected devices"

**Below the output, draw a separate small box (634) labeled "DEBATE CONSTRAINTS 634":**
- maxSpeechesPerMember 636: 2
- timeLimitPerSpeech 638: (none, or value if set)
- debateClosed 640: false

---

### FIG. 7 -- Effect-of-Adoption Processing Flowchart

**Purpose:** Shows the cascading procedural consequences when a motion is disposed. Core of Claim 1(g) and Claim 4.

**Layout:** Landscape orientation (or large portrait). Flowchart with multiple branches.

**Start (top center):**
- Rounded rectangle: "MOTION DISPOSITION EVENT 700"
- "Top motion on stack has been voted on"

**Decision 1 (702):**
- Diamond: "Was the motion ADOPTED or DEFEATED? 702"
- DEFEATED branch (right): Arrow to "Pop motion from stack 728" then to "Record in Decided Motions 730" then to "Restore Speaking State 732" then to End
- ADOPTED branch (down): Continue to a large branching structure

**Decision 2: "What is the motion type?"**
- Draw a large multi-way branch (like a switch statement) with labeled arrows going to separate effect boxes:

  1. Arrow to "AMENDMENT ADOPTED 704": Box contains: "Programmatically modify text field of parent motion in stack to incorporate amendment text"
  2. Arrow to "PREVIOUS QUESTION ADOPTED 706": Box contains: "Set next lower motion's status to VOTING. Set debateClosed flag = true. Bypass further debate"
  3. Arrow to "LAY ON TABLE ADOPTED 708": Box contains: "Serialize entire motion stack. Store in Tabled Motions Repository 734. Clear motion stack"
  4. Arrow to "POSTPONE DEFINITELY ADOPTED 710": Box contains: "Save main motion with resume timestamp to Postponed Motions Repository 738. Clear stack"
  5. Arrow to "POSTPONE INDEFINITELY ADOPTED 712": Box contains: "Remove main motion permanently. Clear stack"
  6. Arrow to "COMMIT/REFER ADOPTED 714": Box contains: "Route main motion to committee with instructions. Clear stack"
  7. Arrow to "ADJOURN ADOPTED 716": Box contains: "Set meeting stage = ADJOURNED 942. Record end timestamp"
  8. Arrow to "RECESS ADOPTED 718": Box contains: "Set meeting stage = RECESS 938. Start recess timer"
  9. Arrow to "SUSPEND RULES ADOPTED 720": Box contains: "Serialize current speaking queue. Set stage = SUSPENDED_RULES 940. Instantiate new temporary speaking queue"
  10. Arrow to "TAKE FROM TABLE ADOPTED 722": Box contains: "Deserialize archived motion stack from Tabled Motions Repository 734. Restore to active stack"
  11. Arrow to "RECONSIDER ADOPTED 724": Box contains: "Return previously decided motion to DEBATING status"
  12. Arrow to "RESCIND ADOPTED 726": Box contains: "Modify or repeal previously adopted resolution"

**All effect boxes then converge via arrows to a common sequence at the bottom:**
- Rectangle: "Pop disposed motion from stack 728"
- Arrow down to: "Record motion and result in Decided Motions History 730"
- Arrow down to: Decision: "Is motion stack now non-empty?"
  - YES: "Restore Saved Speaking State from new top motion 732"
  - NO: "Return to NEW_BUSINESS stage 932"
- Arrow to End

---

### FIG. 8 -- Context-Aware Motion Availability Evaluation Flowchart

**Purpose:** Shows how the system determines which of 28+ motion types are available. Core of Claim 8 and Claim 14.

**Layout:** Landscape orientation. Flowchart with parallel evaluation paths.

**Start (top left):**
- Rounded rectangle: "MOTION AVAILABILITY EVALUATION 800"
- "Triggered on each state change"

**Inputs (top, arranged horizontally):**
- Draw four input boxes feeding into the evaluation:
  - "Meeting Stage 808" (e.g., NEW_BUSINESS)
  - "Motion Stack Contents 804" (top motion, precedence ranks, amendment degree count)
  - "Participant Role 806" (CHAIR / MEMBER / etc.)
  - "Special Conditions 820" (tabled motions count, decided motions, pending point of order, last chair ruling)

**Process (center):**
- Draw a large rectangle labeled "FOR EACH OF 28+ MOTION TYPES, EVALUATE:"
- Inside this rectangle, draw a vertical sequence of check boxes (each is a small rectangle with a check/X):
  1. "Meeting Stage check 810: Is the current stage appropriate for this motion type?"
  2. "Stack State check 812: Does the stack state permit this motion? (e.g., is there a pending question?)"
  3. "Precedence check 814: Does this motion outrank the current top of stack?"
  4. "Amendment Degree check 816: Is the amendment degree within the limit of 2?"
  5. "Role check 818: Does the participant's role permit this action?"
  6. "Special Conditions check 820: Are type-specific conditions met? (e.g., tabled motions exist for Take from Table)"

- Draw a note: "If ANY check fails, motion is marked UNAVAILABLE with the reason from the first failing check"

**Outputs (bottom):**
- Draw two output paths:
  - Left path: "All checks PASS" --> "Available = TRUE 822" --> Draw a mockup of an enabled UI button 826 (a rounded rectangle with text, e.g., "Move to Amend")
  - Right path: "Any check FAILS" --> "Available = FALSE, reason = '[explanation]' 824" --> Draw a mockup of a disabled/grayed-out UI button 828 with a tooltip bubble showing example text: "Cannot make while Previous Question is pending (lower precedence)"

**Bottom annotation:**
- "Result transmitted to each participant device. UI renders only enabled motion buttons. Disabled motions shown with explanatory tooltip."

---

### FIG. 9 -- Real-Time State Synchronization Sequence Diagram

**Purpose:** Shows the message flow between participant devices and the cloud database. Corresponds to Claim 10.

**Layout:** Portrait orientation. UML-style sequence diagram.

**Participants (columns, drawn across the top as labeled vertical lines):**
1. "CHAIR DEVICE 106" (leftmost)
2. "CLOUD DATABASE 102" (center)
3. "MEMBER DEVICE #1 108" (right of center)
4. "MEMBER DEVICE #2 110" (rightmost)

**Draw vertical dashed lines (lifelines) descending from each participant.**

**Sequence of Messages (horizontal arrows between lifelines, arranged top to bottom):**

1. **Chair takes action** (e.g., recognizes a motion):
   - Solid arrow from Chair --> Cloud: "State Update v.N+1 (motion status changed to PENDING_SECOND)"
   - Label the arrow: "Broadcast 904"

2. **Cloud propagates:**
   - Solid arrow from Cloud --> Member #1: "State Update v.N+1"
   - Solid arrow from Cloud --> Member #2: "State Update v.N+1"
   - Label: "Real-time propagation via persistent connection"

3. **Member #1 takes action** (e.g., seconds the motion):
   - Solid arrow from Member #1 --> Cloud: "State Update v.N+2 (motion seconded, status = DEBATING)"

4. **Cloud propagates:**
   - Solid arrow from Cloud --> Chair: "State Update v.N+2"
   - Solid arrow from Cloud --> Member #2: "State Update v.N+2"

5. **Network interruption:**
   - Draw a zigzag line or X across Member #2's lifeline. Label: "Temporary Disconnection"
   - Draw a small box on Member #2's lifeline: "Save to Session Storage 908"

6. **Meanwhile, another action occurs:**
   - Arrow from Chair --> Cloud: "State Update v.N+3"
   - Arrow from Cloud --> Member #1: "State Update v.N+3"
   - Dashed arrow with X from Cloud to Member #2 (not delivered)

7. **Member #2 reconnects:**
   - Arrow from Member #2 --> Cloud: "Reconnect. Local version = N+2, request updates"
   - Label: "State Comparison 912"
   - Arrow from Cloud --> Member #2: "State Update v.N+3 (missed update)"
   - Optional: Arrow from Cloud --> Member #2: "State Migration 906 (if schema version mismatch)"

8. **Heartbeat:**
   - Short dashed arrows from each device to Cloud, labeled "Heartbeat 910" (periodic)

**At the bottom, draw a note box:**
- "Version Number 902: Monotonically increasing. Each state change increments version. Enables detection of missed updates and schema migration."

---

### FIG. 10 -- Meeting Stage State Machine Diagram

**Purpose:** Shows all meeting stages and valid transitions between them. Provides context for the motion availability evaluation.

**Layout:** Landscape orientation. Bubble/state diagram.

**Draw the following state bubbles (rounded rectangles) and arrange them in a flow from left to right, with some branches:**

**Main flow (left to right, top row):**
1. NOT_STARTED 920 (start state, indicated by filled circle with arrow)
2. CALL_TO_ORDER 922
3. ROLL_CALL 924
4. APPROVE_MINUTES 926
5. REPORTS 928
6. UNFINISHED_BUSINESS 930
7. NEW_BUSINESS 932

**Connect with arrows:**
- 920 --> 922: "Chair calls meeting to order"
- 922 --> 924: "Proceed to roll call"
- 924 --> 926: "Quorum confirmed"
- 926 --> 928: "Minutes approved"
- 928 --> 930: "Reports concluded"
- 930 --> 932: "Unfinished business concluded"

**Branch from NEW_BUSINESS (lower row):**
- 932 --> 934 (MOTION_DISCUSSION): "Main motion is made and seconded"
- 934 --> 936 (VOTING): "Debate closes / Chair calls vote"
- 936 --> 932: "Motion decided, return to New Business"
- 934 --> 932: "Motion withdrawn or disposed without vote"

**Special states (draw below or to the side, connected with dashed or colored arrows):**
- 938 (RECESS): Draw with bidirectional arrows from 932 and 934: "Recess motion adopted" / "Recess ends"
- 940 (SUSPENDED_RULES): Draw with bidirectional arrows from 932 and 934: "Suspend Rules adopted" / "Suspension ends"
- 942 (ADJOURNED): Draw as a terminal state (double-bordered). Arrows from 932, 934: "Adjourn motion adopted"

**Special transition from ROLL_CALL:**
- 924 --> 942: Dashed arrow labeled "Quorum NOT met" (meeting cannot proceed)

**Draw an annotation:** "Shaded states (MOTION_DISCUSSION, VOTING) indicate that the Motion Stack is active and the In-Order Check Engine constrains available motions"

---

### FIG. 11 -- Vote Result Determination Flowchart

**Purpose:** Shows how vote results are calculated using different thresholds. Core of Claim 11.

**Layout:** Portrait orientation. Flowchart.

**Start:**
- Rounded rectangle: "VOTE TALLYING COMPLETE 1000"

**Input box (1002):**
- Rectangle: "INPUT: Vote Tally 1002"
- Contents: "Ayes: [count], Nays: [count], Abstentions: [count]"

**Step 1 (1004):**
- Rectangle: "Compute Total Votes Cast 1004"
- "totalCast = Ayes + Nays"
- "NOTE: Abstentions are EXCLUDED per RONR"

**Decision 1 (1006):**
- Diamond: "What is the Vote Threshold Type? 1006"
- Draw FOUR branches:

**Branch A -- MAJORITY (1008):**
- Diamond: "Ayes > totalCast / 2 ? 1008"
- YES: "ADOPTED 1016"
- NO: "DEFEATED 1018"
- Example annotation: "e.g., 15 Ayes, 10 Nays, 3 Abstain. totalCast = 25. 15 > 12.5? YES -> ADOPTED"

**Branch B -- TWO_THIRDS (1010):**
- Diamond: "Ayes >= totalCast x 2/3 ? 1010"
- YES: "ADOPTED 1016"
- NO: "DEFEATED 1018"
- Example annotation: "e.g., 18 Ayes, 10 Nays. totalCast = 28. 18 >= 18.67? NO -> DEFEATED"

**Branch C -- TIE_SUSTAINS_CHAIR (1012):**
- Diamond: "Ayes > Nays ? 1012"
- YES: "ADOPTED 1016 (Chair's ruling overturned)"
- NO: "DEFEATED 1018 (Chair's ruling sustained)"
- Note: "A TIE results in DEFEATED (chair's decision stands)"
- Example annotation: "e.g., 12 Ayes, 12 Nays. 12 > 12? NO -> Chair's decision sustained"

**Branch D -- NONE (1014):**
- Rectangle: "ADOPTED 1016 (Chair decides, no formal vote)"

**All branches converge to:**
- Rectangle: "Trigger Effect-of-Adoption Processing 1020 (see FIG. 7)"
- Arrow to End

---

### FIG. 12 -- User Interface Comparison (Chair View vs. Member View)

**Purpose:** Shows how role-based access control results in different user interfaces. Supports Claims 8-9.

**Layout:** Landscape orientation. Two side-by-side screen mockups.

**IMPORTANT:** These should be simplified, schematic wireframe mockups -- NOT detailed UI designs. Use basic rectangles, text labels, and simple shapes. Patent UI drawings should be clean and minimalist.

**Left Side -- CHAIR VIEW (1100):**
- Draw a large smartphone/tablet outline labeled "CHAIR VIEW 1100"
- Inside, draw the following sections from top to bottom:

  **Header bar:**
  - "Meeting Stage: MOTION_DISCUSSION 1102"
  - "Role: CHAIR"

  **Motion Stack Display (1104):**
  - A small panel labeled "PENDING MOTIONS 1104"
  - Show two stacked bars:
    - Top: "[2] Amendment: Strike 'annual'..." (Status: DEBATING)
    - Bottom: "[1] Main: That the committee shall..." (Status: DEBATING)

  **Action Buttons -- Chair (1106):**
  - Draw a grid of small rounded rectangle buttons:
    - "Recognize Speaker" (enabled, bold outline)
    - "Call the Vote" (enabled)
    - "Second Motion" (disabled/grayed, with tooltip indicator)
    - "Rule on Point of Order" (disabled/grayed)
  - Label this section: "CHAIR ACTION BUTTONS 1106"

  **Voting Controls (1108):**
  - Buttons: "Open Voting" | "Close Voting" | "Announce Result"
  - Label: "VOTING CONTROLS (Chair-only) 1108"

  **Speaking Queue (1110):**
  - Small list panel: "SPEAKING QUEUE 1110"
  - "1. J. Smith (FOR) -- Mover"
  - "2. P. Davis (AGAINST)"
  - "3. K. Brown (FOR)"

  **Pending Requests (1112):**
  - Small list panel: "PENDING REQUESTS 1112"
  - "Parliamentary Inquiry from R. Lee -- [Respond] [Dismiss]"

**Right Side -- MEMBER VIEW (1120):**
- Draw a large smartphone outline labeled "MEMBER VIEW 1120"
- Inside, draw the following sections:

  **Header bar:**
  - "Meeting Stage: MOTION_DISCUSSION 1102"
  - "Role: MEMBER"

  **Motion Stack Display (1104):**
  - Same display as Chair view (members can see pending motions)

  **Action Buttons -- Member (1122):**
  - Draw fewer buttons:
    - "Request to Speak 1126" (enabled)
    - "Raise Incidental Motion 1128" (enabled)
    - "Move to Amend" (enabled)
    - "Lay on the Table" (disabled/grayed with tooltip 1130)
  - Draw a tooltip bubble from the disabled button: "Cannot make while Amendment is pending (lower precedence)"
  - Label: "MEMBER ACTION BUTTONS 1122 -- Fewer options, contextually filtered"

  **Vote Buttons (1124):**
  - Three large buttons in a row: "AYE" | "NAY" | "ABSTAIN"
  - All grayed out with note: "(Voting not currently open)"
  - Label: "VOTE BUTTONS 1124"

  **NO Voting Controls section** (Chair-only, not shown to members)
  **NO Pending Requests action buttons** (Chair-only)

**Between the two views, draw annotations:**
- Arrow pointing to the Chair's extra sections: "Chair-only controls: Recognize speakers, manage voting, resolve requests"
- Arrow pointing to the Member's disabled button: "Context-aware filtering: Only 'in order' motions enabled. Explanatory tooltip for disabled options (Claim 8)"
- Arrow pointing to the difference in button count: "Role-based access control: Different actions available per role (Claim 9)"

---

## ADDITIONAL NOTES FOR THE ILLUSTRATOR

1. **Consistency:** Use the same visual style for the same types of elements across all figures. For example, all decision diamonds should be the same size and style, all process rectangles should use the same border weight, etc.

2. **Reference Numerals:** Every labeled element must have its reference numeral clearly visible and connected by a lead line. Do not place numerals inside hatched or shaded areas. When the same element appears in multiple figures, always use the same numeral.

3. **Flow Direction:** Flowcharts should flow top-to-bottom or left-to-right. Avoid upward or rightward-to-leftward flow arrows where possible. When unavoidable, use clearly curved arrows that are easy to follow.

4. **Data Structure Visualization:** When drawing stacks (LIFO) or queues (FIFO), use visual conventions:
   - LIFO Stack: Vertical rectangle open at top, items stack upward, push/pop at top
   - FIFO Queue: Horizontal rectangle, items enter on left (IN), exit on right (OUT)

5. **State Diagrams:** Use the standard UML-like conventions: filled circle for start state, double-bordered circle for terminal state, rounded rectangles for states, labeled arrows for transitions.

6. **Legibility:** Ensure all text is at least 0.32 cm (1/8 inch) in height when the drawing is reproduced at two-thirds size (the USPTO may reduce drawings). This means original text should be at least 0.48 cm.

7. **No Photographs:** Do not use photographs or halftone reproductions. All elements must be line drawings.

8. **Page Allocation:** Some figures (especially FIG. 7 and FIG. 9) may require a full page. Others (FIG. 3, FIG. 11) can fit on a half-page. You may place two smaller figures on one page if they fit comfortably within the margins, labeled as FIG. 3 and FIG. 11 respectively with clear separation.

9. **Suggested Page Layout:**
   - Page 1: FIG. 1 (full page -- system architecture)
   - Page 2: FIG. 2 (full page -- motion stack detail)
   - Page 3: FIG. 3 (half page, top) and FIG. 11 (half page, bottom)
   - Page 4: FIG. 4 (full page -- precedence validation flowchart)
   - Page 5: FIG. 5 (full page -- dual-track architecture)
   - Page 6: FIG. 6 (full page -- speaking queue algorithm)
   - Page 7: FIG. 7 (full page -- effect-of-adoption)
   - Page 8: FIG. 8 (full page -- motion availability evaluation)
   - Page 9: FIG. 9 (full page -- state synchronization sequence diagram)
   - Page 10: FIG. 10 (full page -- meeting stage state machine)
   - Page 11: FIG. 12 (full page -- UI comparison)
