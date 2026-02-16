# DRAFT PATENT APPLICATION

> **DISCLAIMER:** This is a draft prepared by an AI assistant and is NOT legal advice.
> It must be reviewed, revised, and filed by a registered patent attorney.
> This draft is intended as a starting point for professional patent counsel.

---

## UNITED STATES PATENT APPLICATION

---

### TITLE OF THE INVENTION

**System and Method for Automated Parliamentary Procedure Enforcement in Real-Time Collaborative Meeting Environments**

---

### CROSS-REFERENCE TO RELATED APPLICATIONS

[To be completed by patent attorney if applicable]

---

### FIELD OF THE INVENTION

The present invention relates generally to computer-implemented meeting management systems, and more particularly to a system and method for automatically enforcing parliamentary procedure rules, managing hierarchical motion precedence, prioritizing speaker queues, and synchronizing meeting state across multiple participant devices in real time.

---

### BACKGROUND OF THE INVENTION

Parliamentary procedure, as codified in works such as Robert's Rules of Order Newly Revised (RONR), provides a structured framework for conducting meetings in deliberative assemblies. These rules govern the making, debating, amending, and voting on motions, as well as managing speaker order, quorum requirements, and procedural requests. The rules are complex, involving over 28 distinct motion types organized in a strict precedence hierarchy, each with unique properties regarding debatability, amendability, vote thresholds, and interruptibility.

Traditionally, enforcement of parliamentary procedure has depended entirely on the knowledge and attention of a presiding officer (Chair) and the assembly's parliamentarian. This manual approach is error-prone, particularly in large assemblies, remote meetings, or settings where participants have limited familiarity with parliamentary rules. Common errors include allowing out-of-order motions, miscalculating vote thresholds, failing to alternate between proponents and opponents during debate, and improperly handling amendment degrees.

Existing electronic meeting tools (e.g., video conferencing platforms, voting applications) provide basic meeting infrastructure but do not enforce parliamentary procedure. They do not validate whether a motion is "in order" given the current state of proceedings, do not manage hierarchical motion stacks with precedence, and do not automate the complex effects that follow adoption or defeat of motions.

Prior approaches to computerizing parliamentary procedure have focused primarily on informational guidance. For example, U.S. Patent Application Publication No. US 2013/0046548 A1 (Snider, "Parliamentary Procedure Tools," filed August 19, 2011, now abandoned) discloses a system for providing dynamic context-sensitive information and guidance to meeting participants, converting parliamentary rules into machine-readable formats, and automating meeting recording with metadata. However, Snider's disclosure is directed to presenting informational decision trees and recording meetings -- it does not disclose or suggest a computational engine that actively enforces procedural compliance through a hierarchical motion stack data structure with real-time precedence validation, nor does it disclose a dual-track processing architecture that separates precedence-bound motions from interruptible incidental requests using distinct data structures and routing logic. Snider further does not disclose an algorithm for automatically executing cascading procedural consequences upon motion disposition, preserving and restoring per-motion speaking state across interrupting motions, or prioritizing a speaking queue using a multi-factor algorithm that combines mover priority, stance-based alternation, speaker history tiering, and recency-based fair ordering.

Other existing solutions include electronic voting systems for assemblies (e.g., EP 1889229 B8; U.S. Patent Application Publication No. US 2008/0164329 A1) that provide vote-capturing hardware and software but operate independently of parliamentary procedure logic. Commercial meeting management platforms such as OpenMeeting and Meridia TownVOTE provide speaker queue management and electronic voting features for councils but do not implement computational enforcement of motion precedence hierarchies, do not automatically validate whether motions are "in order" based on stack state, and do not automatically trigger procedural consequences upon motion adoption or defeat.

Academic work, including the "Parliament" software module described by researchers implementing a reusable module for parliamentary procedure bookkeeping, has explored encoding parliamentary rules in software. However, such work has focused on rule specification and bookkeeping rather than on the specific computational architectures and algorithms disclosed herein, particularly the dual-track motion processing architecture, the speaking queue prioritization algorithm with stance alternation and tiered speaker history, and the automatic effect-of-adoption system with cascading state transformations.

There is therefore a need for a computer-implemented system that goes beyond informational guidance to comprehensively and actively enforce parliamentary procedure through specific computational engines and algorithms, ensuring procedural compliance, guiding presiding officers, and enabling real-time collaborative participation while preventing procedural errors through structural constraints in the software architecture itself.

---

### SUMMARY OF THE INVENTION

The present invention provides a computer-implemented system and method that solves specific technical problems arising in real-time collaborative meeting environments through novel data structures, algorithms, and processing architectures. Specifically, the invention addresses the technical problem of maintaining consistent, procedurally valid meeting state across a plurality of networked computing devices in real time, where the state is subject to complex interdependent constraints that cannot be reliably evaluated by a human operator under the time pressures of a live meeting. Unlike prior art systems that merely display informational guidance or record meeting proceedings, the present invention actively constrains the computational state space of the meeting to prevent procedurally invalid transitions, thereby providing an improvement to the functioning of the computer system itself by reducing erroneous state transitions, preventing invalid data entry at the user interface level, and maintaining deterministic state consistency across distributed devices.

The system comprises a plurality of interconnected computational engines and algorithms that together enforce complex parliamentary rules through structural constraints in the software architecture, including:

1. **A Motion Stack Precedence Engine** that maintains a hierarchical stack data structure of pending motions, validates new motions against precedence rules before allowing them onto the stack, tracks motion lifecycle states, and manages amendment degree limitations.

2. **A Dual-Track Motion Processing Architecture** that separates standard precedence-bound motions from interruptible incidental requests (such as Points of Order and Parliamentary Inquiries), allowing the latter to be processed without disrupting the motion stack.

3. **An Intelligent Speaking Queue Prioritization Algorithm** that automatically orders speakers according to parliamentary rules, including mover priority, alternation between proponents and opponents, preference for first-time speakers over repeat speakers, and fair time-based ordering.

4. **An Automatic Effect-of-Adoption System** that, upon the adoption or defeat of a motion, automatically triggers the procedural consequences prescribed by parliamentary rules without requiring manual intervention by the presiding officer.

5. **A Context-Aware Motion Availability Engine** that evaluates 28+ motion types against current meeting state, user role, motion stack contents, and procedural conditions to determine which motions are currently "in order" and presents only valid options to each participant with explanatory reasons for unavailable options.

6. **A Real-Time Collaborative State Synchronization System** that maintains consistent meeting state across all connected participant devices, with role-based access control that presents appropriate interfaces and capabilities based on each participant's role (Chair, Vice Chair, Secretary, Member).

7. **A Flexible Quorum Management Engine** supporting both absolute numeric and fractional quorum rules with dynamic calculation based on current participants.

---

### DETAILED DESCRIPTION OF THE INVENTION

#### I. SYSTEM ARCHITECTURE OVERVIEW

The system of the present invention comprises a client application executing on participant computing devices (smartphones, tablets, desktop computers) and a cloud-based real-time database service for state synchronization. The client application includes:

- A presentation layer providing role-specific user interfaces
- A business logic layer comprising multiple specialized engines
- A data layer managing local session persistence and remote state synchronization
- A rules database encoding comprehensive parliamentary procedure definitions

The system architecture separates concerns into the following principal components:

**A. Engine Layer**
- Motion Stack Engine
- In-Order Check Engine (Motion Availability Engine)
- Debate Engine
- Vote Engine
- Pending Requests Engine
- Quorum Engine

**B. State Management Layer**
- Meeting State Hook (central state management)
- Modal State Management
- Heartbeat/Connection Monitoring

**C. Services Layer**
- Meeting Connection Service (real-time synchronization)
- Minutes Export Service (document generation)

**D. Presentation Layer**
- Meeting View (primary interface)
- Role-specific action panels
- Motion stack display
- Voting interface
- Speaking queue interface
- Multiple modal dialogs for specific motion types

---

#### II. MOTION STACK PRECEDENCE ENGINE

##### A. Data Structure

The Motion Stack Precedence Engine maintains a Last-In-First-Out (LIFO) stack data structure wherein each element represents a pending motion. Each motion entry in the stack comprises:

- A unique identifier
- The motion type (selected from 28+ defined types)
- The motion text (human-readable description of what is proposed)
- The name of the member who moved the motion
- The name of the member who seconded the motion (if applicable)
- The current status within the motion lifecycle
- Vote tallies (ayes, nays, abstentions) with per-member tracking
- A record of which members have voted
- Speaking history associated with this motion
- The current speaking state (who has the floor, speaking queue)
- Amendment degree (for amendment-type motions)
- The precedence rank of the motion type
- A complete rules profile (debatable, amendable, vote threshold, etc.)

##### B. Motion Lifecycle States

Each motion on the stack transitions through the following states:

1. **PENDING_CHAIR** - Motion has been proposed but not yet recognized by the Chair
2. **PENDING_SECOND** - Chair has recognized the motion; awaiting a second from another member
3. **DEBATING** - Motion has been seconded (or does not require a second) and is open for debate
4. **VOTING** - Debate has concluded and the assembly is voting on the motion
5. **DECIDED** - The motion has been adopted or defeated and removed from the stack

##### C. Precedence Validation Algorithm

When a participant attempts to add a new motion to the stack, the system executes the following validation:

```
FUNCTION validateMotionPrecedence(newMotion, currentStack):
    IF currentStack is empty:
        IF newMotion is a main motion:
            RETURN valid
        ELSE IF newMotion is privileged AND can be made without a pending question:
            RETURN valid
        ELSE:
            RETURN invalid("No main motion is pending")

    topMotion = currentStack.top()

    IF newMotion.category == SUBSIDIARY:
        IF newMotion.precedence <= topMotion.precedence:
            RETURN invalid("Motion does not have sufficient precedence")
        IF topMotion.status != DEBATING:
            RETURN invalid("Current motion is not in a debatable state")
        RETURN valid

    IF newMotion.category == PRIVILEGED:
        IF newMotion.precedence <= topMotion.precedence:
            RETURN invalid("Motion does not have sufficient precedence")
        RETURN valid

    IF newMotion.category == INCIDENTAL:
        // Incidental motions are processed through the Pending Requests track
        RETURN routeToPendingRequests(newMotion)

    RETURN invalid("Cannot make this motion while another is pending")
```

##### D. Amendment Degree Tracking

The system enforces the parliamentary rule that amendments may only be nested to two degrees:

- **Primary Amendment (Degree 1):** An amendment to a main motion or other amendable motion
- **Secondary Amendment (Degree 2):** An amendment to a primary amendment
- **Tertiary Amendment (Degree 3+):** NOT PERMITTED

The system tracks the current amendment degree within the stack and rejects any attempt to create an amendment that would exceed two degrees.

```
FUNCTION validateAmendmentDegree(currentStack):
    amendmentCount = 0
    FOR each motion in currentStack (top to bottom):
        IF motion.type == AMEND:
            amendmentCount++
    IF amendmentCount >= 2:
        RETURN invalid("Cannot exceed two degrees of amendment")
    RETURN valid
```

##### E. Speaking State Preservation

When a subsidiary or privileged motion interrupts debate on a pending motion, the system preserves the speaking state (current speaker, speaking queue, speaking history) of the interrupted motion. When the interrupting motion is disposed of, the preserved speaking state is restored, allowing debate to resume seamlessly.

```
FUNCTION pushMotionWithSpeakingPreservation(newMotion, currentStack):
    IF currentStack is not empty:
        topMotion = currentStack.top()
        topMotion.savedSpeakingState = {
            currentSpeaker: topMotion.currentSpeaker,
            speakingQueue: topMotion.speakingQueue,
            speakingHistory: topMotion.speakingHistory
        }
    currentStack.push(newMotion)
    RETURN currentStack

FUNCTION popMotionWithSpeakingRestoration(currentStack):
    disposedMotion = currentStack.pop()
    IF currentStack is not empty:
        topMotion = currentStack.top()
        IF topMotion.savedSpeakingState exists:
            topMotion.currentSpeaker = topMotion.savedSpeakingState.currentSpeaker
            topMotion.speakingQueue = topMotion.savedSpeakingState.speakingQueue
            topMotion.speakingHistory = topMotion.savedSpeakingState.speakingHistory
            DELETE topMotion.savedSpeakingState
    RETURN { disposedMotion, currentStack }
```

---

#### III. DUAL-TRACK MOTION PROCESSING ARCHITECTURE

The present invention introduces a novel dual-track architecture that separates parliamentary actions into two processing tracks:

##### Track 1: Motion Stack (Precedence-Bound)

Handles motions that follow strict precedence ordering:
- Main Motions
- Subsidiary Motions (Postpone Indefinitely, Amend, Refer to Committee, Postpone Definitely, Limit/Extend Debate, Previous Question, Lay on the Table)
- Privileged Motions (Call for Orders of the Day, Question of Privilege, Recess, Adjourn, Fix Time to Which to Adjourn)
- Bring-Back Motions (Take from the Table, Reconsider, Rescind/Amend Previously Adopted)

##### Track 2: Pending Requests Queue (Interrupt-Capable)

Handles incidental motions and requests that may interrupt proceedings:
- Point of Order
- Appeal the Decision of the Chair
- Parliamentary Inquiry
- Request for Information
- Division of the Assembly
- Objection to the Consideration of the Question
- Suspend the Rules
- Withdraw a Motion

The Pending Requests Queue operates as a First-In-First-Out (FIFO) queue that allows incidental requests to be raised even while a speaker holds the floor, if the request type has the "canInterrupt" property. The Chair processes pending requests before returning to the motion stack.

```
FUNCTION processPendingRequest(request, meetingState):
    IF request.canInterrupt:
        // Queue immediately, even if someone is speaking
        meetingState.pendingRequests.enqueue(request)
        meetingState.notifyChair(request)
    ELSE:
        IF meetingState.currentSpeaker == null:
            meetingState.pendingRequests.enqueue(request)
        ELSE:
            RETURN invalid("Cannot raise this request while another has the floor")

    RETURN meetingState
```

This dual-track architecture reflects the actual practice of parliamentary procedure where certain incidental requests (e.g., a Point of Order) can interrupt a speaker mid-sentence, while standard motions must wait for the floor to be yielded.

---

#### IV. INTELLIGENT SPEAKING QUEUE PRIORITIZATION ALGORITHM

The system implements a novel speaking queue prioritization algorithm that automates complex parliamentary speaking order rules. The algorithm considers multiple factors simultaneously:

##### A. Priority Tiers

The algorithm assigns speakers to priority tiers:

1. **Tier 0 (Highest Priority):** The member who moved the motion, if they have not yet spoken on it (RONR grants the mover the right to speak first)
2. **Tier 1:** Members who have not yet spoken on the current question (new speakers)
3. **Tier 2:** Members who have previously spoken on the current question (repeat speakers), subject to the maximum speeches per question limit

##### B. Stance-Based Alternation

Within each tier, the algorithm alternates between speakers who are "for" (pro) and "against" (con) the motion, implementing RONR's principle of fair debate:

```
FUNCTION sortWithStanceAlternation(speakers):
    proSpeakers = speakers.filter(s => s.stance == PRO)
    conSpeakers = speakers.filter(s => s.stance == CON)
    neutralSpeakers = speakers.filter(s => s.stance == NEUTRAL)

    // Sort each group by lastSpokeTime (ascending) then requestTime (ascending)
    sortByRecency(proSpeakers)
    sortByRecency(conSpeakers)
    sortByRecency(neutralSpeakers)

    result = []
    WHILE proSpeakers OR conSpeakers OR neutralSpeakers are not empty:
        IF proSpeakers not empty: result.add(proSpeakers.removeFirst())
        IF conSpeakers not empty: result.add(conSpeakers.removeFirst())
        IF neutralSpeakers not empty: result.add(neutralSpeakers.removeFirst())

    RETURN result
```

##### C. Recency-Based Fair Ordering

Within each stance group, speakers are ordered by the time since they last spoke (longest wait first), with ties broken by the time they entered the speaking queue (earliest first).

##### D. Debate Constraint Enforcement

The Debate Engine enforces constraints including:
- Maximum number of speeches per member per question (default: 2 per RONR)
- Time limit per speech (if imposed by a Limit Debate motion)
- Total debate time limits
- Automatic closure when Previous Question is adopted

```
FUNCTION canMemberSpeak(member, motion, debateConstraints):
    speechCount = countSpeechesOnMotion(member, motion)
    IF speechCount >= debateConstraints.maxSpeechesPerMember:
        RETURN false("Member has exhausted their speaking turns on this question")
    IF debateConstraints.debateClosed:
        RETURN false("Debate has been closed by Previous Question")
    IF NOT motion.rules.debatable:
        RETURN false("This motion is not debatable")
    RETURN true
```

---

#### V. AUTOMATIC EFFECT-OF-ADOPTION SYSTEM

When a motion is adopted or defeated, the system automatically executes the procedural consequences prescribed by parliamentary rules. This eliminates a common source of Chair error and ensures procedural compliance.

##### A. Effect Mapping

Each motion type has an associated adoption effect:

| Motion Type | Effect of Adoption |
|---|---|
| Main Motion | Resolution is adopted; recorded in minutes |
| Amendment | Text of the amended motion is modified to incorporate the amendment |
| Postpone Indefinitely | Main motion is killed; removed from consideration |
| Refer to Committee | Main motion is sent to committee with specified instructions |
| Postpone to Definite Time | Main motion is saved with a resume timestamp |
| Limit/Extend Debate | Debate parameters are modified on the motion to which it was applied |
| Previous Question | Debate is immediately closed; proceed to vote on the next pending question |
| Lay on the Table | Entire motion stack is archived for potential later retrieval |
| Adjourn | Meeting enters Adjourned state |
| Recess | Meeting enters Recess state with specified duration |
| Appeal (sustained) | Chair's ruling stands |
| Appeal (overturned) | Chair's ruling is reversed |
| Suspend the Rules | Meeting enters Suspended Rules mode with temporary speaking lists |
| Take from the Table | Archived motion stack is restored to active stack |
| Reconsider | Previously decided motion is returned to debate |
| Rescind/Amend Previously Adopted | Previously adopted resolution is modified or repealed |

##### B. Cascading Effect Processing

```
FUNCTION handleMotionDisposition(motion, result, meetingState):
    IF result == ADOPTED:
        SWITCH motion.type:
            CASE AMEND:
                parentMotion = getParentMotion(meetingState.motionStack)
                parentMotion.text = applyAmendment(parentMotion.text, motion.text)

            CASE PREVIOUS_QUESTION:
                nextMotion = meetingState.motionStack.peek(1)  // next below top
                nextMotion.status = VOTING
                nextMotion.debateClosed = true

            CASE LAY_ON_TABLE:
                meetingState.tabledMotions.push(meetingState.motionStack.getAll())
                meetingState.motionStack.clear()

            CASE POSTPONE_DEFINITELY:
                meetingState.postponedMotions.push({
                    motion: meetingState.motionStack.getMainMotion(),
                    resumeTime: motion.metadata.postponeTime
                })
                meetingState.motionStack.clear()

            CASE ADJOURN:
                meetingState.stage = ADJOURNED
                meetingState.endTime = currentTimestamp()

            CASE SUSPEND_RULES:
                meetingState.stage = SUSPENDED_RULES
                meetingState.savedSpeakingList = meetingState.currentSpeakingList
                meetingState.currentSpeakingList = new SpeakingList()

            // ... additional cases for each motion type

    // Remove decided motion from stack
    meetingState.motionStack.pop()

    // Record in decided motions history
    meetingState.decidedMotions.push({
        motion: motion,
        result: result,
        timestamp: currentTimestamp()
    })

    // Restore speaking state if returning to a pending motion
    IF meetingState.motionStack is not empty:
        restoreSpeakingState(meetingState.motionStack.top())

    RETURN meetingState
```

---

#### VI. CONTEXT-AWARE MOTION AVAILABILITY ENGINE

The system evaluates all 28+ motion types against current meeting conditions to determine which motions are currently "in order." This evaluation considers:

##### A. Evaluation Criteria

1. **Meeting Stage:** Certain motions are only available during specific stages (e.g., main motions only during New Business)
2. **Motion Stack State:** Precedence rules, amendment degree limits, and whether a main motion is pending
3. **User Role:** Some actions are Chair-only (e.g., ruling on Points of Order)
4. **Motion Status:** Whether the top motion is in a debatable, votable, or pending state
5. **Special Conditions:** Whether there are pending requests, suspended rules, tabled motions, decided motions eligible for reconsideration, etc.

##### B. Availability Determination Algorithm

```
FUNCTION getAvailableMotions(meetingState, currentUser):
    availableMotions = []

    FOR each motionType in ALL_MOTION_TYPES:
        result = evaluateMotionAvailability(motionType, meetingState, currentUser)
        availableMotions.push({
            type: motionType,
            enabled: result.isAvailable,
            reason: result.reason  // Human-readable explanation
        })

    RETURN availableMotions

FUNCTION evaluateMotionAvailability(motionType, meetingState, currentUser):
    rules = getMotionRules(motionType)
    stack = meetingState.motionStack

    // Check role permissions
    IF motionType requires Chair role AND currentUser.role != CHAIR:
        RETURN { isAvailable: false, reason: "Only the Chair may do this" }

    // Check meeting stage
    IF motionType == MAIN_MOTION AND meetingState.stage != NEW_BUSINESS:
        RETURN { isAvailable: false, reason: "Main motions may only be made during New Business" }

    // Check if stack is empty (needed for subsidiary/some privileged motions)
    IF rules.requiresPendingQuestion AND stack.isEmpty():
        RETURN { isAvailable: false, reason: "No motion is currently pending" }

    // Check precedence
    IF NOT stack.isEmpty():
        topMotion = stack.top()
        IF rules.precedence <= topMotion.precedence AND rules.category == SUBSIDIARY:
            RETURN { isAvailable: false, reason: "This motion is outranked by " + topMotion.name }

    // Check amendment degree
    IF motionType == AMEND:
        IF countAmendmentDegree(stack) >= 2:
            RETURN { isAvailable: false, reason: "Cannot exceed two degrees of amendment" }

    // Check for tabled motions (for Take from Table)
    IF motionType == TAKE_FROM_TABLE AND meetingState.tabledMotions.isEmpty():
        RETURN { isAvailable: false, reason: "No motions have been laid on the table" }

    // Check for decided motions (for Reconsider)
    IF motionType == RECONSIDER AND NOT hasReconsiderableMotions(meetingState):
        RETURN { isAvailable: false, reason: "No motions are eligible for reconsideration" }

    // ... additional type-specific checks

    RETURN { isAvailable: true, reason: "Motion is in order" }
```

##### C. User Interface Integration

The Motion Availability Engine drives the user interface, ensuring that:
- Only "in order" motions are presented as active options to the user
- Disabled motions show explanatory tooltips describing why they are unavailable
- The interface adapts based on the user's role (Chair sees different options than Members)
- Category-specific modal dialogs present relevant subsets of available motions

---

#### VII. REAL-TIME COLLABORATIVE STATE SYNCHRONIZATION

##### A. State Synchronization Architecture

The system maintains meeting state consistency across all connected participant devices through a cloud-based real-time database. The synchronization system:

1. Broadcasts state changes from any participant's action to all connected devices
2. Implements optimistic local updates with server reconciliation
3. Maintains session persistence through local storage, surviving page refreshes and temporary disconnections
4. Tracks participant activity through periodic heartbeat signals

##### B. State Versioning and Migration

The system implements a state versioning mechanism that:
- Tags each meeting state with a version number
- Detects when a client connects with an outdated state version
- Automatically migrates older state formats to the current version
- Ensures backward compatibility as the system evolves

```
FUNCTION migrateState(state):
    WHILE state.version < CURRENT_VERSION:
        state = applyMigration(state, state.version, state.version + 1)
    RETURN state
```

##### C. Role-Based Access Control

The system implements role-based access control with four defined roles:

1. **Chair (President):** Full meeting control; can recognize speakers, call votes, rule on points of order, manage meeting stages
2. **Vice Chair:** Inherits Chair capabilities if the Chair is absent; otherwise has Member capabilities
3. **Secretary:** Member capabilities plus minutes management
4. **Member:** Can make motions, request to speak, vote, raise incidental requests

Each role determines:
- Which action buttons are visible and enabled
- Which motions the participant can initiate
- Which meeting management functions are available
- What information is displayed in the interface

---

#### VIII. FLEXIBLE QUORUM MANAGEMENT ENGINE

The Quorum Engine supports configurable quorum rules that can be defined as:

##### A. Absolute Number Quorum
A fixed number of members required for a quorum (e.g., "10 members constitute a quorum").

##### B. Fractional Quorum
A fraction of the total membership, supporting:
- **Majority:** Floor(totalMembers / 2) + 1
- **One-Third:** Ceiling(totalMembers / 3)
- **Two-Thirds:** Ceiling(totalMembers * 2 / 3)

##### C. Dynamic Calculation

```
FUNCTION resolveQuorum(quorumRule, participantCount):
    IF quorumRule.type == 'number':
        RETURN quorumRule.value
    ELSE IF quorumRule.type == 'fraction':
        SWITCH quorumRule.value:
            CASE 'majority': RETURN Math.floor(participantCount / 2) + 1
            CASE '1/3':      RETURN Math.ceil(participantCount / 3)
            CASE '2/3':      RETURN Math.ceil(participantCount * 2 / 3)
    RETURN participantCount  // default: all members required
```

The system checks quorum at roll call and prevents the meeting from proceeding to business if quorum is not met.

---

#### IX. VOTE RESULT DETERMINATION ENGINE

The Vote Engine implements multiple voting thresholds as required by different motion types:

##### A. Voting Thresholds

1. **Majority:** More than half of votes cast (ayes > total/2). Abstentions are not counted as votes cast per RONR.
2. **Two-Thirds:** At least two-thirds of votes cast (ayes >= total * 2/3).
3. **Tie Sustains Chair:** For appeals from the decision of the Chair, a tie vote sustains the Chair's ruling (ayes > nays required to overturn).
4. **No Vote Required:** The Chair decides without a vote (for certain procedural motions).

##### B. Vote Integrity

The system tracks individual votes by participant name, preventing double voting while maintaining a record for verification purposes. The Division of the Assembly feature allows any member to request a recount by a more precise method.

```
FUNCTION determineVoteResult(motion):
    ayes = motion.votes.aye
    nays = motion.votes.nay
    totalCast = ayes + nays  // Abstentions do not count as votes cast

    SWITCH motion.rules.voteRequired:
        CASE MAJORITY:
            adopted = (totalCast > 0) AND (ayes > totalCast / 2)
        CASE TWO_THIRDS:
            adopted = (totalCast > 0) AND (ayes >= totalCast * 2 / 3)
        CASE TIE_SUSTAINS_CHAIR:
            adopted = ayes > nays  // Tie means chair's decision stands
        CASE NONE:
            adopted = true  // Chair decides, no vote needed

    RETURN {
        adopted: adopted,
        description: generateResultDescription(motion, adopted, ayes, nays)
    }
```

---

#### X. MEETING MINUTES EXPORT SYSTEM

The system maintains a chronological log of all meeting actions and provides automated export to standard document formats (e.g., Microsoft Word DOCX). The minutes include:

- Meeting start time and participants
- Roll call results
- All motions made, seconded, debated, and decided
- Vote tallies for each motion
- Points of order and chair rulings
- Recess and adjournment records
- Timestamps for all entries

---

### CLAIMS

**What is claimed is:**

**1.** A computer-implemented method for enforcing parliamentary procedure in a real-time collaborative meeting conducted across a plurality of networked participant computing devices, the method comprising:
- (a) maintaining, in a memory of at least one processor, a hierarchical motion stack data structure stored as a Last-In-First-Out (LIFO) stack, the motion stack comprising a plurality of motion entries, each motion entry being a structured data record that includes at least: a motion type identifier selected from a defined set of parliamentary motion types, a numerical precedence rank, a lifecycle status value, a vote tally data structure tracking individual votes by participant identifier, a speaking state data structure comprising a current speaker identifier, an ordered speaking queue, and a speaking history log, and a rules profile data structure encoding debatability, amendability, vote threshold type, and interruptibility properties;
- (b) receiving, via a network communication from a participant computing device, a request to add a new motion to the motion stack, the request specifying a motion type identifier;
- (c) executing, by the processor, a precedence validation algorithm that retrieves the rules profile of the requested motion type, retrieves the precedence rank and lifecycle status of the topmost motion entry in the motion stack, and compares the numerical precedence rank of the new motion against the numerical precedence rank of the topmost motion;
- (d) permitting the new motion to be pushed onto the motion stack only upon determining that: (i) the motion stack is empty and the new motion is categorized as a main motion, or (ii) the new motion has a strictly higher numerical precedence rank than the topmost motion and the topmost motion is in a debatable lifecycle status;
- (e) rejecting the new motion and transmitting, to the requesting participant computing device, a structured response comprising a human-readable explanation of why the motion is not in order, when the precedence validation fails;
- (f) tracking the lifecycle status of each motion entry through a defined sequence of computational states comprising: PENDING_CHAIR, PENDING_SECOND, DEBATING, VOTING, and DECIDED, wherein each state transition is triggered by a specific presiding officer or participant action received via the network;
- (g) upon disposition of the topmost motion entry, automatically executing, by the processor without additional input from the presiding officer, one or more procedural consequence operations determined by the motion type of the disposed motion, the procedural consequence operations comprising at least one of: modifying a data field of another motion entry in the stack, removing one or more motion entries from the stack and storing them in a separate archive data structure, transitioning a different motion entry to a different lifecycle status, or transitioning the meeting to a different meeting stage; and
- (h) broadcasting, via the network, the updated motion stack state to all connected participant computing devices to synchronize the meeting state in real time.

**2.** The method of claim 1, further comprising:
- prior to pushing the new motion onto the motion stack, serializing the speaking state data structure of the topmost motion entry into a preserved speaking state record, the preserved speaking state record comprising the current speaker identifier, the ordered speaking queue, and the speaking history log;
- storing the preserved speaking state record in association with the topmost motion entry;
- upon disposition of the new motion and its removal from the motion stack, deserializing the preserved speaking state record and restoring the current speaker identifier, ordered speaking queue, and speaking history log to the now-topmost motion entry;
whereby debate on the interrupted motion resumes with the same speaking context that existed prior to the interruption, without requiring the presiding officer to manually reconstruct the speaking order.

**3.** The method of claim 1, further comprising:
- traversing the motion stack from top to bottom and counting the number of motion entries having an amendment motion type to determine a current amendment degree value;
- upon receiving a request to add an amendment-type motion, comparing the current amendment degree value against a maximum amendment degree threshold of two; and
- rejecting the amendment-type motion and transmitting a structured response to the requesting device when the current amendment degree value equals or exceeds the maximum amendment degree threshold;
whereby the processor enforces the parliamentary rule prohibiting amendments beyond two degrees through structural constraints in the data structure rather than relying on human judgment.

**4.** The method of claim 1, wherein automatically executing procedural consequence operations comprises:
- when an amendment motion is adopted: programmatically modifying the text data field of the parent motion entry in the motion stack to incorporate the amendment text;
- when a close-debate motion is adopted: programmatically setting the lifecycle status of the next lower motion entry in the stack to VOTING and setting a debate-closed flag, thereby bypassing further debate;
- when a table motion is adopted: removing all motion entries from the motion stack, serializing them into an archive data structure stored in a tabled motions repository, and clearing the motion stack;
- when an adjourn motion is adopted: transitioning the meeting stage state to ADJOURNED and recording an end timestamp; and
- when a take-from-table motion is adopted: deserializing a previously archived set of motion entries from the tabled motions repository and restoring them to the motion stack;
wherein each procedural consequence operation is a deterministic state transformation defined by the motion type's rules profile, requiring no discretionary input from the presiding officer.

**5.** A computer-implemented method for managing a speaking queue in a parliamentary meeting conducted across a plurality of networked participant computing devices, the method comprising:
- (a) maintaining, in a memory of at least one processor, a speaking queue data structure comprising a plurality of speaker entries, each speaker entry being a structured data record including at least: a participant identifier, a request timestamp, a stance indicator selected from {FOR, AGAINST, NEUTRAL}, and a speaking history count for the current pending motion;
- (b) receiving, via a network communication, a request from a participant to be added to the speaking queue, the request including the participant identifier and the stance indicator;
- (c) executing, by the processor, a multi-factor sorting algorithm that reorders the speaking queue by:
  - (i) extracting and placing at position zero the speaker entry whose participant identifier matches the mover of the current pending motion, if said mover has a speaking history count of zero for the current pending motion;
  - (ii) partitioning remaining speaker entries into a first-time speaker group having speaking history count of zero and a repeat speaker group having speaking history count greater than zero;
  - (iii) within each group, performing a stance-alternation sort that interleaves speaker entries having stance indicator FOR with speaker entries having stance indicator AGAINST, placing speaker entries having stance indicator NEUTRAL after each alternated pair;
  - (iv) within each stance subgroup, ordering speaker entries by time elapsed since last speaking in descending order, with ties broken by request timestamp in ascending order; and
  - (v) concatenating the sorted first-time speaker group before the sorted repeat speaker group;
- (d) transmitting the reordered speaking queue to all connected participant computing devices; and
- (e) upon the presiding officer recognizing a speaker, updating the speaking history count for that participant and re-executing the multi-factor sorting algorithm on the remaining queue.

**6.** The method of claim 5, further comprising:
- maintaining a debate constraints data structure associated with the current pending motion, the debate constraints data structure comprising a maximum speeches per member value, a time limit per speech value, and a debate-closed flag;
- upon receiving a request to add a participant to the speaking queue, comparing said participant's speaking history count against the maximum speeches per member value and rejecting the request when the count equals or exceeds the maximum;
- upon a limit-debate motion being adopted, programmatically updating the time limit per speech value in the debate constraints data structure; and
- upon a close-debate motion being adopted, setting the debate-closed flag and transmitting to all connected participant computing devices a notification that no further speakers will be recognized;
whereby debate limits imposed by parliamentary motions are automatically enforced by the processor through modification of the debate constraints data structure, without requiring the presiding officer to manually track speaking counts or time limits.

**7.** A computer-implemented system for parliamentary meeting management across a plurality of networked participant computing devices, the system comprising:
- at least one processor;
- a memory coupled to the processor;
- a network interface for communicating with the plurality of participant computing devices; and
- instructions stored in the memory that, when executed by the processor, cause the system to:
  - (a) maintain, in the memory, a first data structure comprising a motion stack implemented as a Last-In-First-Out (LIFO) stack that enforces a numerical precedence ordering among motion entries categorized as main motions, subsidiary motions, privileged motions, and bring-back motions, wherein each push operation onto the motion stack requires the processor to execute a precedence validation algorithm comparing numerical precedence ranks before permitting the operation;
  - (b) maintain, in the memory, a second data structure comprising a pending requests queue implemented as a First-In-First-Out (FIFO) queue, the pending requests queue being structurally separate from the motion stack and processing incidental motions and procedural requests independently of the motion stack, wherein each request entry in the pending requests queue includes an interruptibility flag, and wherein request entries having the interruptibility flag set to true are enqueued even when a current speaker is recognized;
  - (c) upon receiving a parliamentary action request via the network interface, executing a routing algorithm that inspects the category of the requested action and directs the action to either the motion stack or the pending requests queue based on the category, such that precedence-bound actions are processed through the motion stack and interrupt-capable incidental actions are processed through the pending requests queue;
  - (d) for the motion stack, executing the precedence validation algorithm before permitting each push operation and transmitting a human-readable rejection explanation via the network interface when validation fails;
  - (e) for the pending requests queue, presenting queued requests to the presiding officer's computing device via the network interface and processing the presiding officer's resolution of each request; and
  - (f) upon any state change to either the motion stack or the pending requests queue, broadcasting the complete updated meeting state via the network interface to all connected participant computing devices to maintain real-time synchronization.

**8.** The system of claim 7, wherein the instructions further cause the processor to:
- for each of a defined set of 28 or more parliamentary motion types, execute a context-aware availability evaluation that inspects at least: the current meeting stage, the contents of the motion stack including the precedence rank and lifecycle status of each motion entry, the current amendment degree count, the contents of the tabled motions repository, the contents of the decided motions history, and the role of the requesting participant;
- generate, for each motion type, an availability result comprising a boolean availability value and a human-readable reason string;
- transmit to each participant computing device a filtered set of motion types comprising only those motion types having a true availability value as selectable user interface elements; and
- for motion types having a false availability value, render the reason string as an explanatory tooltip or notification on the participant computing device;
whereby the user interface structurally prevents participants from attempting out-of-order motions by presenting only contextually valid options, reducing the computational and cognitive burden on the presiding officer.

**9.** The system of claim 7, wherein the instructions further cause the processor to:
- maintain a participant registry data structure associating each connected participant with a role identifier selected from {CHAIR, VICE_CHAIR, SECRETARY, MEMBER};
- for each parliamentary action request received via the network interface, determine whether the action is permitted for the requesting participant's role by consulting a role-permission mapping;
- when the CHAIR role participant disconnects, automatically reassign the CHAIR role to the participant having the VICE_CHAIR role identifier; and
- generate role-specific user interface configurations transmitted to each participant computing device, wherein action buttons, motion options, and meeting management controls are included or excluded from the configuration based on the participant's role identifier;
whereby different participants viewing the same meeting on their respective computing devices are presented with different available actions reflecting their parliamentary role.

**10.** The system of claim 7, wherein broadcasting the complete updated meeting state comprises:
- serializing the motion stack, pending requests queue, speaking queue, vote tallies, meeting stage, and participant registry into a versioned state object tagged with a monotonically increasing version number;
- transmitting the versioned state object to a cloud-based real-time database service via the network interface;
- the cloud-based real-time database service propagating the versioned state object to all connected participant computing devices via persistent network connections;
- each participant computing device maintaining a local copy of the meeting state in session storage to survive page refreshes and temporary network disconnections;
- upon reconnection after a temporary disconnection, comparing the local state version number against the version number in the cloud-based real-time database and applying any missed state updates; and
- when a participant computing device connects with a state version number lower than a current schema version, executing a state migration function that transforms the state object from the older schema to the current schema;
whereby meeting state remains consistent across all participant devices even in the presence of network interruptions, page refreshes, and software version updates.

**11.** A computer-implemented method for determining vote results in a parliamentary meeting, the method comprising:
- (a) associating, by a processor, a vote threshold requirement with each motion entry in a motion stack based on the motion entry's motion type, the vote threshold requirement being stored in the motion entry's rules profile data structure and selected from the group consisting of: MAJORITY requiring ayes to exceed one-half of total votes cast, TWO_THIRDS requiring ayes to equal or exceed two-thirds of total votes cast, TIE_SUSTAINS_CHAIR requiring ayes to strictly exceed nays for the motion to be adopted, and NONE requiring no vote whereby the presiding officer decides;
- (b) receiving, via a network interface from each of a plurality of participant computing devices, a vote selection being one of: AYE, NAY, or ABSTAIN;
- (c) storing each vote selection in the motion entry's vote tally data structure indexed by participant identifier, and rejecting duplicate vote submissions from the same participant identifier;
- (d) calculating the vote result by: computing a total votes cast value as the sum of AYE votes and NAY votes excluding ABSTAIN votes, and applying the vote threshold requirement associated with the motion type to the computed total; and
- (e) upon determining the vote result, invoking the procedural consequence operation associated with the motion type to automatically execute the effect of adoption or defeat on the motion stack and meeting state without additional input from the presiding officer.

**12.** A computer-implemented method for managing quorum in a parliamentary meeting conducted across a plurality of networked participant computing devices, the method comprising:
- (a) receiving, by a processor via a network interface, a quorum rule definition data structure, the quorum rule definition comprising a rule type selected from {ABSOLUTE_NUMBER, FRACTION} and a rule value, wherein the rule value is an integer when the rule type is ABSOLUTE_NUMBER and is a fraction identifier selected from {MAJORITY, ONE_THIRD, TWO_THIRDS} when the rule type is FRACTION;
- (b) dynamically calculating a required quorum count by: when the rule type is ABSOLUTE_NUMBER, using the rule value directly; when the rule type is FRACTION and the fraction identifier is MAJORITY, computing floor(participantCount / 2) + 1; when the fraction identifier is ONE_THIRD, computing ceiling(participantCount / 3); when the fraction identifier is TWO_THIRDS, computing ceiling(participantCount * 2 / 3);
- (c) at a roll call meeting stage, counting the number of participants marked as present and comparing the count against the required quorum count; and
- (d) when the present count is less than the required quorum count, preventing the meeting stage from transitioning to a business stage and transmitting a quorum-not-met notification to all connected participant computing devices;
whereby the quorum requirement is computationally enforced at the meeting stage transition level, preventing any business from being conducted without a quorum regardless of presiding officer action.

**13.** A non-transitory computer-readable medium storing instructions that, when executed by at least one processor communicating with a plurality of networked participant computing devices via a network interface, cause the processor to perform a method comprising:
- maintaining, in a memory, a hierarchical motion stack implemented as a LIFO stack data structure, each motion entry comprising a structured data record with motion type, precedence rank, lifecycle status, vote tally, and speaking state sub-structures, wherein push operations are gated by a precedence validation algorithm that compares numerical precedence ranks and rejects motions not meeting precedence requirements;
- maintaining, in the memory, a separate pending requests queue implemented as a FIFO queue data structure for processing interruptible incidental motions independently of the motion stack;
- executing a multi-factor speaking queue prioritization algorithm that sorts speaker entries by mover priority, first-time versus repeat speaker tiering, stance-based alternation interleaving pro and con speakers, and recency-based fair ordering within each subgroup;
- upon disposition of a motion entry, automatically executing deterministic procedural consequence operations defined by the motion type's rules profile, the consequence operations comprising state transformations on the motion stack, tabled motions archive, or meeting stage without requiring presiding officer input;
- calculating vote results by applying motion-type-specific vote thresholds from the group {MAJORITY, TWO_THIRDS, TIE_SUSTAINS_CHAIR, NONE} to recorded vote tallies; and
- broadcasting updated meeting state to all connected participant computing devices via the network interface to maintain real-time state synchronization.

**14.** The non-transitory computer-readable medium of claim 13, wherein the instructions further cause the processor to:
- for each of a defined set of parliamentary motion types, execute a context-aware availability evaluation inspecting at least the current meeting stage, motion stack contents, amendment degree count, and requesting participant role;
- generate for each motion type a boolean availability result and a human-readable reason string; and
- transmit to each participant computing device a user interface configuration comprising only selectable controls for motion types having a true availability result, together with explanatory reason strings for motion types having a false availability result;
whereby the user interface on each participant computing device is dynamically constrained to prevent out-of-order parliamentary actions.

**15.** The method of claim 1, further comprising:
- upon adoption of a suspend-the-rules motion, serializing the current speaking queue data structure and meeting stage into a saved state record;
- transitioning the meeting to a suspended-rules stage in which a new temporary speaking queue data structure is instantiated and custom vote threshold parameters are accepted; and
- upon conclusion of the suspended-rules stage, deserializing the saved state record and restoring the prior speaking queue and meeting stage;
whereby the system supports temporary suspension of procedural rules while maintaining the ability to seamlessly resume normal proceedings.

**16.** The method of claim 1, wherein the defined set of parliamentary motion types comprises at least 28 distinct types organized into five categories: main motions, subsidiary motions having precedence ranks 1 through 7, privileged motions having precedence ranks 8 through 12, incidental motions having no precedence ranking among themselves, and bring-back motions; and wherein the rules profile data structure for each motion type is defined in a declarative rules database that maps each motion type identifier to its category, precedence rank, seconding requirement, debatability, amendability, vote threshold type, interruptibility, and the set of other motion types that may be applied to it.

**17.** The system of claim 7, wherein the instructions further cause the processor to:
- maintain a chronological meeting log data structure recording timestamped entries for each parliamentary action including motions made, seconds received, speakers recognized, votes cast, vote results, points of order raised, and chair rulings;
- upon receiving a request to export meeting minutes, programmatically generating a formatted document from the meeting log data structure, the formatted document comprising structured sections for attendance, roll call results, motions and their dispositions, vote tallies, and adjournment; and
- transmitting the formatted document to a requesting participant computing device;
whereby a complete and procedurally accurate record of the meeting is automatically generated from the computational state maintained during the meeting.

**18.** The method of claim 5, wherein the multi-factor sorting algorithm is re-executed each time:
- a new speaker entry is added to the speaking queue;
- a speaker completes their speaking turn and their speaking history count is incremented;
- a motion is disposed and the speaking state is restored from a preserved speaking state record; or
- a new motion is pushed onto the motion stack requiring a fresh speaking queue;
whereby the speaking order dynamically adapts to changing conditions throughout the meeting without manual reordering by the presiding officer.

---

### ABSTRACT

A computer-implemented system and method for automated parliamentary procedure enforcement in real-time collaborative meeting environments conducted across a plurality of networked computing devices. The system maintains a hierarchical motion stack implemented as a LIFO data structure with a precedence validation algorithm that gates all push operations, a dual-track processing architecture using structurally separate data structures for precedence-bound motions (motion stack) and interruptible incidental requests (pending requests FIFO queue), and a multi-factor speaking queue prioritization algorithm that sorts speakers by mover priority, first-time versus repeat speaker tiering, stance-based alternation, and recency-based fair ordering. Upon motion disposition, the system automatically executes deterministic procedural consequence operations defined by the motion type's rules profile, including cascading state transformations on the motion stack, speaking state preservation and restoration across interrupting motions, and meeting stage transitions. A context-aware motion availability engine evaluates 28+ motion types against current meeting state to dynamically constrain each participant's user interface to only procedurally valid options. Meeting state is serialized as a versioned state object and synchronized across all connected participant devices via a cloud-based real-time database, with session persistence, state migration, and role-based access control. The system further provides flexible quorum management with fractional and absolute rules, multi-threshold vote determination with per-participant tracking, and automated meeting minutes document generation.

---

### DRAWINGS

[Note: Patent drawings should be prepared by a professional patent illustrator. The following descriptions indicate the recommended drawing figures:]

**FIG. 1** - System Architecture Overview Diagram showing the relationship between client application components, cloud database, and participant devices.

**FIG. 2** - Motion Stack Data Structure Diagram showing the LIFO stack with example motion entries and their properties.

**FIG. 3** - Motion Lifecycle State Diagram showing transitions between Pending Chair, Pending Second, Debating, Voting, and Decided states.

**FIG. 4** - Precedence Validation Flowchart showing the decision process for allowing or rejecting a new motion.

**FIG. 5** - Dual-Track Motion Processing Diagram showing the separation between the Motion Stack track and the Pending Requests Queue track.

**FIG. 6** - Speaking Queue Prioritization Algorithm Flowchart showing tier assignment, stance alternation, and recency-based ordering.

**FIG. 7** - Effect-of-Adoption Processing Flowchart showing the cascading consequences when different motion types are adopted.

**FIG. 8** - Context-Aware Motion Availability Evaluation Flowchart showing the decision criteria for enabling/disabling each motion type.

**FIG. 9** - Real-Time State Synchronization Sequence Diagram showing message flow between participant devices and the cloud database.

**FIG. 10** - Meeting Stage State Machine Diagram showing all meeting stages and valid transitions.

**FIG. 11** - Vote Result Determination Flowchart showing threshold application for different vote types.

**FIG. 12** - User Interface Screenshots showing Chair view and Member view with role-specific action panels.

---

### INVENTOR(S)

[To be completed]

### ASSIGNEE

[To be completed]

### FILING DATE

[To be completed]

---

> **PRIOR ART IDENTIFIED DURING PRELIMINARY SEARCH:**
>
> 1. **US 2013/0046548 A1** (Snider, "Parliamentary Procedure Tools," filed Aug. 19, 2011) -- ABANDONED.
>    Discloses informational guidance, decision trees, and automated recording for parliamentary meetings.
>    Does NOT disclose: motion stack with precedence validation, dual-track processing, speaking queue
>    prioritization algorithm, automatic effect-of-adoption system, or speaking state preservation/restoration.
>    **Differentiation strategy:** Claims emphasize specific data structures (LIFO motion stack, FIFO pending
>    requests queue), specific algorithms (precedence validation, multi-factor speaker sorting), and
>    automatic deterministic state transformations -- none of which are disclosed in Snider.
>
> 2. **EP 1889229 B8** -- Electronic voting system for AGMs. Voting hardware/software only;
>    no parliamentary procedure enforcement logic.
>
> 3. **US 2008/0164329 A1** -- Voting apparatus. Hardware-focused; no procedural enforcement.
>
> 4. **"Parliament" software module** (academic paper, ResearchGate) -- Reusable module implementing
>    RONR bookkeeping. Focuses on rule specification, not on the specific algorithms and architectures
>    disclosed herein. Not a patent.
>
> 5. **Commercial products** (OpenMeeting, Meridia TownVOTE, Robert's Rules 21, iBabs) -- Provide speaker
>    queues and voting features but do not implement precedence-validating motion stacks, dual-track
>    processing, or automatic effect-of-adoption cascading. No patents found for these products.
>
> **NEXT STEPS FOR PATENT ATTORNEY:**
> 1. Review and refine all claims for proper patent claim language and scope
> 2. Conduct a comprehensive professional prior art search (USPTO, EPO, WIPO) beyond the preliminary web search above
> 3. Prepare formal patent drawings (FIG. 1-12)
> 4. Review dependent claims and consider additional independent claims
> 5. Consider provisional vs. non-provisional filing strategy
> 6. Evaluate international filing needs (PCT application)
> 7. Assess whether to file as a utility patent, design patent, or both
> 8. **35 U.S.C. 101 (Alice) analysis:** Claims have been drafted to emphasize specific technical improvements (novel data structures, algorithms, and real-time distributed state synchronization) rather than the abstract idea of "automating parliamentary rules." Attorney should verify that claims sufficiently recite an "inventive concept" under the Alice/Mayo two-step framework. Key technical elements to emphasize: (a) the LIFO motion stack with algorithmic precedence gating, (b) the dual-track architecture using structurally separate data structures with category-based routing, (c) the multi-factor speaking queue sorting algorithm, (d) the deterministic state transformation engine for effect-of-adoption, and (e) real-time distributed state synchronization with versioning and migration.
> 9. Review for compliance with 35 U.S.C. sections 102 (novelty), 103 (non-obviousness), and 112 (written description and enablement)
> 10. Consider adding method-of-use claims for specific user workflows
> 11. Evaluate trade secret protection as an alternative or complement for certain algorithms
> 12. Consider continuation or divisional applications to separately protect the speaking queue algorithm (Claims 5-6, 18) and the dual-track architecture (Claim 7) as independent inventions
