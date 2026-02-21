# Hatsell — Translation Reference

> **Instructions for translators:**
> - For each entry, replace the empty `TRANSLATION:` line with your translated text
> - Keep `{{variable}}` placeholders exactly as they are (e.g. `{{name}}`, `{{count}}`)
> - Keep HTML tags (`<strong>`, etc.) exactly as they are
> - The `KEY:` identifies the string — do not modify it
> - Lines starting with `EN:` show the English source text
>
> **To import translations back:** Give this completed file to Claude and ask it to
> generate the JSON locale files from it.

---

## common (22 keys)

KEY: common:app_name
EN: Hatsell
TRANSLATION:

KEY: common:app_subtitle
EN: Parliamentary Meeting Assistant
TRANSLATION:

KEY: common:based_on_ronr
EN: Based on Robert's Rules of Order
TRANSLATION:

KEY: common:button_back
EN: Back
TRANSLATION:

KEY: common:button_cancel
EN: Cancel
TRANSLATION:

KEY: common:button_close
EN: Close
TRANSLATION:

KEY: common:button_confirm
EN: Confirm
TRANSLATION:

KEY: common:button_submit
EN: Submit
TRANSLATION:

KEY: common:button_save
EN: Save
TRANSLATION:

KEY: common:button_delete
EN: Delete
TRANSLATION:

KEY: common:button_continue
EN: Continue
TRANSLATION:

KEY: common:button_ok
EN: OK
TRANSLATION:

KEY: common:button_yes
EN: Yes
TRANSLATION:

KEY: common:button_no
EN: No
TRANSLATION:

KEY: common:role_chair
EN: Chair
TRANSLATION:

KEY: common:role_vice_chair
EN: Vice Chair
TRANSLATION:

KEY: common:role_secretary
EN: Secretary
TRANSLATION:

KEY: common:role_member
EN: Member
TRANSLATION:

KEY: common:role_president
EN: President/Chair
TRANSLATION:

KEY: common:label_meeting_code
EN: Meeting Code
TRANSLATION:

KEY: common:label_your_name
EN: Your Name
TRANSLATION:

KEY: common:label_version
EN: v2.1.0
TRANSLATION:

## login (18 keys)

KEY: login:tab_join
EN: Join Meeting
TRANSLATION:

KEY: login:tab_create
EN: Create Meeting
TRANSLATION:

KEY: login:label_your_name
EN: Your Name
TRANSLATION:

KEY: login:label_meeting_code
EN: Meeting Code
TRANSLATION:

KEY: login:placeholder_name
EN: e.g. John Hatsell
TRANSLATION:

KEY: login:placeholder_code
EN: e.g. XKGLS
TRANSLATION:

KEY: login:button_join
EN: Join Meeting
TRANSLATION:

KEY: login:button_joining
EN: Joining...
TRANSLATION:

KEY: login:button_create
EN: Create Meeting
TRANSLATION:

KEY: login:error_code_required
EN: Meeting code is required to join a meeting.
TRANSLATION:

KEY: login:error_no_meeting
EN: No meeting found with that code. Check the code and try again.
TRANSLATION:

KEY: login:error_join_failed
EN: Failed to join meeting. Please try again.
TRANSLATION:

KEY: login:error_name_required
EN: Please enter your name first.
TRANSLATION:

KEY: login:trust_copy_line1
EN: Hatsell runs entirely in your browser. No account required.
TRANSLATION:

KEY: login:trust_copy_line2
EN: Meeting data is not stored on our servers.
TRANSLATION:

KEY: login:link_about
EN: About Hatsell
TRANSLATION:

KEY: login:link_tutorial
EN: First Time?
TRANSLATION:

KEY: login:language_toggle
EN: Português
TRANSLATION:

## meeting (366 keys)

KEY: meeting:stage_not_started_title
EN: Meeting Not Started
TRANSLATION:

KEY: meeting:stage_not_started_desc
EN: Waiting for chair to call meeting to order
TRANSLATION:

KEY: meeting:stage_not_started_subtitle
EN: Members may join using their meeting code
TRANSLATION:

KEY: meeting:stage_call_to_order_title
EN: Call to Order
TRANSLATION:

KEY: meeting:stage_call_to_order_desc
EN: The chair will call the meeting to order
TRANSLATION:

KEY: meeting:stage_roll_call_title
EN: Roll Call
TRANSLATION:

KEY: meeting:stage_roll_call_desc
EN: Establishing quorum
TRANSLATION:

KEY: meeting:stage_approve_minutes_title
EN: Approve Minutes
TRANSLATION:

KEY: meeting:stage_approve_minutes_desc
EN: Review and approve minutes from previous meeting
TRANSLATION:

KEY: meeting:stage_approve_minutes_subtitle
EN: Corrections may be proposed before approval
TRANSLATION:

KEY: meeting:stage_adopt_agenda_title
EN: Adopt Agenda
TRANSLATION:

KEY: meeting:stage_adopt_agenda_desc
EN: Review and adopt the proposed agenda
TRANSLATION:

KEY: meeting:stage_agenda_item_title
EN: Agenda Item {{index}}: {{title}}
TRANSLATION:

KEY: meeting:stage_agenda_item_title_default
EN: Agenda Item
TRANSLATION:

KEY: meeting:stage_agenda_item_desc
EN: Item {{current}} of {{total}}
TRANSLATION:

KEY: meeting:stage_agenda_item_desc_default
EN: Processing agenda items
TRANSLATION:

KEY: meeting:stage_new_business_title
EN: New Business
TRANSLATION:

KEY: meeting:stage_new_business_desc
EN: Members may introduce new motions
TRANSLATION:

KEY: meeting:stage_pending_second_title
EN: {{motionName}} - Pending Second
TRANSLATION:

KEY: meeting:stage_pending_second_desc
EN: {{motionName}} requires a second to proceed
TRANSLATION:

KEY: meeting:stage_pending_second_subtitle
EN: A second is required before debate may begin
TRANSLATION:

KEY: meeting:stage_motion_pending_second
EN: Motion Pending Second
TRANSLATION:

KEY: meeting:stage_motion_pending_second_desc
EN: Motion requires a second to proceed
TRANSLATION:

KEY: meeting:stage_discussion_title
EN: Discussion: {{motionName}}
TRANSLATION:

KEY: meeting:stage_discussion_default
EN: Discussion
TRANSLATION:

KEY: meeting:stage_discussion_desc
EN: Debating: "{{text}}"
TRANSLATION:

KEY: meeting:stage_discussion_desc_default
EN: Members debate the motion on the floor
TRANSLATION:

KEY: meeting:stage_voting_title
EN: Voting: {{motionName}}
TRANSLATION:

KEY: meeting:stage_voting_default
EN: Voting in Progress
TRANSLATION:

KEY: meeting:stage_voting_desc
EN: Members cast their votes
TRANSLATION:

KEY: meeting:stage_recess_title
EN: Meeting in Recess
TRANSLATION:

KEY: meeting:stage_recess_desc
EN: The meeting is temporarily recessed
TRANSLATION:

KEY: meeting:stage_recess_subtitle
EN: Business resumes when the chair reconvenes
TRANSLATION:

KEY: meeting:stage_suspended_rules_title
EN: RULES SUSPENDED
TRANSLATION:

KEY: meeting:stage_suspended_rules_desc_default
EN: Rules have been suspended
TRANSLATION:

KEY: meeting:stage_suspended_rules_subtitle
EN: Normal parliamentary procedure is temporarily set aside
TRANSLATION:

KEY: meeting:stage_adjourned_title
EN: Meeting Adjourned
TRANSLATION:

KEY: meeting:stage_adjourned_desc
EN: Meeting has concluded
TRANSLATION:

KEY: meeting:stage_adjourned_subtitle
EN: Minutes may be exported for the record
TRANSLATION:

KEY: meeting:topbar_stage_not_started
EN: Not Started
TRANSLATION:

KEY: meeting:topbar_stage_call_to_order
EN: Call to Order
TRANSLATION:

KEY: meeting:topbar_stage_roll_call
EN: Roll Call
TRANSLATION:

KEY: meeting:topbar_stage_approve_minutes
EN: Minutes
TRANSLATION:

KEY: meeting:topbar_stage_adopt_agenda
EN: Adopt Agenda
TRANSLATION:

KEY: meeting:topbar_stage_agenda_item
EN: Agenda
TRANSLATION:

KEY: meeting:topbar_stage_reports
EN: Reports
TRANSLATION:

KEY: meeting:topbar_stage_unfinished_business
EN: Unfinished Business
TRANSLATION:

KEY: meeting:topbar_stage_new_business
EN: New Business
TRANSLATION:

KEY: meeting:topbar_stage_motion_discussion
EN: Discussion
TRANSLATION:

KEY: meeting:topbar_stage_voting
EN: Voting
TRANSLATION:

KEY: meeting:topbar_stage_recess
EN: Recess
TRANSLATION:

KEY: meeting:topbar_stage_suspended_rules
EN: Rules Suspended
TRANSLATION:

KEY: meeting:topbar_stage_adjourned
EN: Adjourned
TRANSLATION:

KEY: meeting:topbar_members
EN: Members
TRANSLATION:

KEY: meeting:topbar_queue
EN: Queue
TRANSLATION:

KEY: meeting:topbar_log
EN: Log
TRANSLATION:

KEY: meeting:topbar_leave
EN: Leave
TRANSLATION:

KEY: meeting:drawer_members_title
EN: Members ({{count}})
TRANSLATION:

KEY: meeting:drawer_speaking_queue
EN: Speaking Queue
TRANSLATION:

KEY: meeting:drawer_meeting_log
EN: Meeting Log
TRANSLATION:

KEY: meeting:drawer_currently_speaking
EN: Currently Speaking:
TRANSLATION:

KEY: meeting:drawer_queue_empty
EN: No one in the speaking queue.
TRANSLATION:

KEY: meeting:drawer_log_empty
EN: No log entries yet.
TRANSLATION:

KEY: meeting:drawer_export_minutes
EN: Export Minutes (.docx)
TRANSLATION:

KEY: meeting:drawer_export_minutes_tooltip
EN: Download formal minutes as an editable Word document
TRANSLATION:

KEY: meeting:drawer_repeat
EN: (repeat)
TRANSLATION:

KEY: meeting:quorum_label
EN: Quorum:
TRANSLATION:

KEY: meeting:quorum_present_of_required
EN: {{present}} present of {{required}} required
TRANSLATION:

KEY: meeting:quorum_rule_label
EN: Rule: {{rule}}
TRANSLATION:

KEY: meeting:motion_stack_title
EN: Motion Stack ({{count}} Pending)
TRANSLATION:

KEY: meeting:motion_stack_label
EN: Motions on the floor
TRANSLATION:

KEY: meeting:decided_motions_label
EN: Decided motions
TRANSLATION:

KEY: meeting:decided_motions_title
EN: Decided Motions ({{count}})
TRANSLATION:

KEY: meeting:highest_precedence
EN: Highest Precedence
TRANSLATION:

KEY: meeting:stack_position
EN: #{{position}} in stack
TRANSLATION:

KEY: meeting:degree_1st
EN: 1st
TRANSLATION:

KEY: meeting:degree_2nd
EN: 2nd
TRANSLATION:

KEY: meeting:amendment_proposed_label
EN: If adopted, the motion would read:
TRANSLATION:

KEY: meeting:moved_by
EN: Moved by
TRANSLATION:

KEY: meeting:seconded_by
EN: Seconded by
TRANSLATION:

KEY: meeting:requires_vote
EN: Requires {{threshold}} vote
TRANSLATION:

KEY: meeting:amendment_history
EN: Amendment History
TRANSLATION:

KEY: meeting:original_text
EN: Original: "{{text}}"
TRANSLATION:

KEY: meeting:amendment_number
EN: Amendment {{number}}: "{{text}}"
TRANSLATION:

KEY: meeting:to_adopt
EN: {{threshold}} to adopt
TRANSLATION:

KEY: meeting:debatable_label
EN: Debatable:
TRANSLATION:

KEY: meeting:amendable_label
EN: Amendable:
TRANSLATION:

KEY: meeting:second_label
EN: Second:
TRANSLATION:

KEY: meeting:yes
EN: Yes
TRANSLATION:

KEY: meeting:no
EN: No
TRANSLATION:

KEY: meeting:required
EN: Required
TRANSLATION:

KEY: meeting:not_required
EN: Not required
TRANSLATION:

KEY: meeting:chair_script_second
EN: It has been moved: "{{text}}". Is there a second?
TRANSLATION:

KEY: meeting:motions_on_stack
EN: {{count}} motions on the stack
TRANSLATION:

KEY: meeting:category_main
EN: Main
TRANSLATION:

KEY: meeting:category_subsidiary
EN: Subsidiary
TRANSLATION:

KEY: meeting:category_privileged
EN: Privileged
TRANSLATION:

KEY: meeting:category_incidental
EN: Incidental
TRANSLATION:

KEY: meeting:category_bring_back
EN: Bring Back
TRANSLATION:

KEY: meeting:agenda_cat_informational_report
EN: Informational / Report
TRANSLATION:

KEY: meeting:agenda_cat_general_business
EN: General Business (Main Motion)
TRANSLATION:

KEY: meeting:agenda_cat_rescind_amend
EN: Rescind / Amend Something Previously Adopted
TRANSLATION:

KEY: meeting:agenda_cat_bylaw_amendments
EN: Bylaw Amendments
TRANSLATION:

KEY: meeting:agenda_cat_election
EN: Election
TRANSLATION:

KEY: meeting:agenda_cat_disciplinary
EN: Formal Disciplinary Procedure
TRANSLATION:

KEY: meeting:agenda_cat_financial
EN: Financial Matters (Budget / Dues / Assessments)
TRANSLATION:

KEY: meeting:disclaimer_title
EN: Disclaimer
TRANSLATION:

KEY: meeting:disclaimer_text
EN: Hatsell is a tool to help meetings using a parliamentary authority. It is not supposed to replace them. Any conflict between Hatsell and the chosen parliamentary authority should be decided in favor of the official text.
TRANSLATION:

KEY: meeting:disclaimer_data_title
EN: Data & Privacy
TRANSLATION:

KEY: meeting:disclaimer_data_firebase
EN: Meeting data is transmitted via Firebase for real-time sync
TRANSLATION:

KEY: meeting:disclaimer_data_local
EN: Organization profiles are stored locally in your browser (not sent to any server)
TRANSLATION:

KEY: meeting:disclaimer_data_session
EN: Session data is cleared when the browser tab closes
TRANSLATION:

KEY: meeting:disclaimer_data_no_personal
EN: No personal data is collected or shared with third parties
TRANSLATION:

KEY: meeting:disclaimer_data_temp
EN: Meeting data in Firebase is temporary
TRANSLATION:

KEY: meeting:disclaimer_agree
EN: I agree
TRANSLATION:

KEY: meeting:disclaimer_continue
EN: Continue to Meeting
TRANSLATION:

KEY: meeting:inactivity_title
EN: Meeting Inactive
TRANSLATION:

KEY: meeting:inactivity_text
EN: This meeting has been inactive for 30 minutes. It will automatically adjourn if no action is taken.
TRANSLATION:

KEY: meeting:inactivity_resume
EN: Resume Meeting
TRANSLATION:

KEY: meeting:inactivity_end
EN: End Meeting
TRANSLATION:

KEY: meeting:notification_joined
EN: {{name}} has joined
TRANSLATION:

KEY: meeting:notification_left
EN: {{name}} has left
TRANSLATION:

KEY: meeting:recess_label
EN: Recess
TRANSLATION:

KEY: meeting:recess_overtime
EN: Recess time elapsed
TRANSLATION:

KEY: meeting:recess_remaining
EN: remaining
TRANSLATION:

KEY: meeting:recess_over
EN: over scheduled recess
TRANSLATION:

KEY: meeting:proposed_agenda
EN: Proposed Agenda
TRANSLATION:

KEY: meeting:agenda_item_of
EN: Item {{index}} of {{total}}: {{title}}
TRANSLATION:

KEY: meeting:agenda_min_target
EN: ({{minutes}} min target)
TRANSLATION:

KEY: meeting:point_of_order_banner
EN: POINT OF ORDER
TRANSLATION:

KEY: meeting:raised_by
EN: Raised by:
TRANSLATION:

KEY: meeting:concern_label
EN: Concern:
TRANSLATION:

KEY: meeting:sustain_point
EN: Sustain Point of Order
TRANSLATION:

KEY: meeting:point_not_sustained
EN: Point Not Sustained
TRANSLATION:

KEY: meeting:pending_amendments_title
EN: Pending Amendments ({{count}})
TRANSLATION:

KEY: meeting:amend_wait_speaker
EN: A member has the floor — wait for them to yield before recognizing amendments.
TRANSLATION:

KEY: meeting:amend_wait_vote
EN: A vote is in progress — announce the result before recognizing amendments.
TRANSLATION:

KEY: meeting:amend_must_recognize
EN: You must recognize or decline pending amendments before proceeding.
TRANSLATION:

KEY: meeting:amend_proposer_wishes
EN: {{name}} wishes to propose:
TRANSLATION:

KEY: meeting:recognize_amendment
EN: Recognize Amendment
TRANSLATION:

KEY: meeting:decline_amendment
EN: Decline
TRANSLATION:

KEY: meeting:pending_motions_title
EN: Pending Motions ({{count}})
TRANSLATION:

KEY: meeting:pending_wait_speaker
EN: A member has the floor — wait for them to yield before recognizing motions.
TRANSLATION:

KEY: meeting:pending_awaiting_second
EN: Awaiting a second on the current motion before recognizing others.
TRANSLATION:

KEY: meeting:pending_resolve_priority
EN: These motions were proposed while a speaker had the floor. Resolve highest-priority first.
TRANSLATION:

KEY: meeting:pending_moves
EN: {{name}} moves: "{{text}}"
TRANSLATION:

KEY: meeting:recognize_button
EN: Recognize
TRANSLATION:

KEY: meeting:dismiss_button
EN: Dismiss
TRANSLATION:

KEY: meeting:tooltip_resolve_higher
EN: Resolve higher-priority motions first
TRANSLATION:

KEY: meeting:tooltip_wait_speaker
EN: Wait for speaker to yield
TRANSLATION:

KEY: meeting:tooltip_recognize_motion
EN: Recognize this motion
TRANSLATION:

KEY: meeting:tooltip_dismiss_motion
EN: Dismiss this motion
TRANSLATION:

KEY: meeting:tooltip_awaiting_second
EN: Awaiting second on current motion
TRANSLATION:

KEY: meeting:motion_on_floor
EN: Motion on the Floor
TRANSLATION:

KEY: meeting:moved_by_label
EN: Moved by: {{name}}
TRANSLATION:

KEY: meeting:seconded_by_label
EN: Seconded by: {{name}}
TRANSLATION:

KEY: meeting:adjourned_export_msg
EN: Meeting adjourned. You can export the minutes below.
TRANSLATION:

KEY: meeting:export_minutes_docx
EN: Export Minutes (.docx)
TRANSLATION:

KEY: meeting:next_speaker_queue
EN: Next Speaker ({{count}} in queue)
TRANSLATION:

KEY: meeting:tooltip_next_speaker
EN: Give the floor to the next person in queue
TRANSLATION:

KEY: meeting:chair_more
EN: More... (use sparingly)
TRANSLATION:

KEY: meeting:chair_impartial_note
EN: The chair should remain impartial. Use these tools only when necessary, such as when the chair wishes to make a motion (after passing the gavel to the vice-chair).
TRANSLATION:

KEY: meeting:interrupted_raised_by
EN: Raised by {{name}}
TRANSLATION:

KEY: meeting:interrupted_suspend
EN: Please suspend your intervention. Your clock has been paused.
TRANSLATION:

KEY: meeting:vote_cast_title
EN: Cast Your Vote
TRANSLATION:

KEY: meeting:vote_aye
EN: Aye
TRANSLATION:

KEY: meeting:vote_nay
EN: Nay
TRANSLATION:

KEY: meeting:vote_abstain
EN: Abstain
TRANSLATION:

KEY: meeting:vote_recorded
EN: Your vote has been recorded
TRANSLATION:

KEY: meeting:vote_ayes
EN: Ayes
TRANSLATION:

KEY: meeting:vote_nays
EN: Nays
TRANSLATION:

KEY: meeting:vote_abstentions
EN: Abstentions
TRANSLATION:

KEY: meeting:vote_tally_aria
EN: Votes: {{aye}} aye, {{nay}} nay, {{abstain}} abstain
TRANSLATION:

KEY: meeting:vote_threshold
EN: Threshold: {{threshold}} | Abstentions do not count as votes cast
TRANSLATION:

KEY: meeting:vote_original
EN: Original: "{{text}}"
TRANSLATION:

KEY: meeting:vote_amendment_num
EN: Amendment {{num}}: "{{text}}"
TRANSLATION:

KEY: meeting:vote_preliminary_appeal_sustained
EN: Preliminary: Appeal Sustained
TRANSLATION:

KEY: meeting:vote_preliminary_appeal_denied
EN: Preliminary: Appeal Denied
TRANSLATION:

KEY: meeting:vote_preliminary_passes
EN: Preliminary: Motion Passes
TRANSLATION:

KEY: meeting:vote_preliminary_fails
EN: Preliminary: Motion Fails
TRANSLATION:

KEY: meeting:vote_announce_result
EN: Announce Result
TRANSLATION:

KEY: meeting:vote_division
EN: Division
TRANSLATION:

KEY: meeting:vote_threshold_required
EN: {{threshold}} required. Results will be announced by the chair.
TRANSLATION:

KEY: meeting:vote_all_voted
EN: All participants have voted
TRANSLATION:

KEY: meeting:vote_all_voted_chair
EN: All members have voted — chair may vote or announce
TRANSLATION:

KEY: meeting:vote_open_countdown
EN: Voting open ({{seconds}}s until early close)
TRANSLATION:

KEY: meeting:vote_threshold_achieved
EN: Threshold achieved - may announce
TRANSLATION:

KEY: meeting:vote_waiting_threshold
EN: Waiting for threshold ({{seconds}}s until auto-close)
TRANSLATION:

KEY: meeting:vote_waiting_votes
EN: Waiting for votes ({{seconds}}s until auto-close)
TRANSLATION:

KEY: meeting:vote_period_complete
EN: Voting period complete - non-voters counted as abstentions
TRANSLATION:

KEY: meeting:roll_call_title
EN: Roll Call
TRANSLATION:

KEY: meeting:roll_call_officers_note
EN: Chair, Vice Chair, and Secretary are automatically present (officers conducting the meeting).
TRANSLATION:

KEY: meeting:roll_call_all_officers
EN: All officers are present. No members to call.
TRANSLATION:

KEY: meeting:roll_call_click_complete
EN: Click "Complete Roll Call" to proceed.
TRANSLATION:

KEY: meeting:roll_call_instructions
EN: Call each member. Click "Complete Roll Call" when all have responded.
TRANSLATION:

KEY: meeting:roll_call_status_present
EN: Present
TRANSLATION:

KEY: meeting:roll_call_status_called
EN: Called — Click to Confirm
TRANSLATION:

KEY: meeting:roll_call_status_click
EN: Click to Call
TRANSLATION:

KEY: meeting:roll_call_auto_present_officer
EN: As {{role}}, you are automatically present (presiding officer).
TRANSLATION:

KEY: meeting:roll_call_secretary_conducting
EN: The Secretary is conducting roll call.
TRANSLATION:

KEY: meeting:roll_call_auto_present_secretary
EN: As Secretary, you are automatically present (conducting roll call).
TRANSLATION:

KEY: meeting:roll_call_waiting
EN: Waiting for your name to be called...
TRANSLATION:

KEY: meeting:roll_call_responded
EN: You have responded to roll call.
TRANSLATION:

KEY: meeting:roll_call_your_name_called
EN: Your name has been called!
TRANSLATION:

KEY: meeting:roll_call_present_button
EN: Present
TRANSLATION:

KEY: meeting:minutes_title
EN: Approval of Minutes
TRANSLATION:

KEY: meeting:minutes_read_request
EN: {{name}} requested the minutes to be read
TRANSLATION:

KEY: meeting:minutes_read_button
EN: Read the Minutes
TRANSLATION:

KEY: meeting:minutes_dismiss_button
EN: Dismiss
TRANSLATION:

KEY: meeting:minutes_correction_debate
EN: Correction Before the Assembly (Objection Raised):
TRANSLATION:

KEY: meeting:minutes_proposed_by
EN: — Proposed by {{name}}
TRANSLATION:

KEY: meeting:minutes_call_vote_correction
EN: Call Vote on Correction
TRANSLATION:

KEY: meeting:minutes_debate_note
EN: Debate the correction, then the chair may put it to a vote.
TRANSLATION:

KEY: meeting:minutes_proposed_correction
EN: Proposed Correction:
TRANSLATION:

KEY: meeting:minutes_accept_consent
EN: Accept by Consent (No Objection)
TRANSLATION:

KEY: meeting:minutes_objection_raised
EN: Objection Raised
TRANSLATION:

KEY: meeting:minutes_i_object
EN: I Object
TRANSLATION:

KEY: meeting:minutes_before_assembly
EN: The minutes from the previous meeting are before the assembly for approval.
TRANSLATION:

KEY: meeting:minutes_request_read
EN: Request Minutes Be Read
TRANSLATION:

KEY: meeting:minutes_propose_correction
EN: Propose Correction
TRANSLATION:

KEY: meeting:speaking_in_favor
EN: Speaking in Favor
TRANSLATION:

KEY: meeting:speaking_against
EN: Speaking Against
TRANSLATION:

KEY: meeting:yield_button
EN: Yield
TRANSLATION:

KEY: meeting:pending_requests_title
EN: Pending Requests ({{count}})
TRANSLATION:

KEY: meeting:request_by
EN: by {{name}}
TRANSLATION:

KEY: meeting:request_chair_response
EN: Chair response:
TRANSLATION:

KEY: meeting:request_sustain
EN: Sustain
TRANSLATION:

KEY: meeting:request_not_sustained
EN: Not Sustained
TRANSLATION:

KEY: meeting:request_accept
EN: Accept
TRANSLATION:

KEY: meeting:request_dismiss
EN: Dismiss
TRANSLATION:

KEY: meeting:request_placeholder
EN: Enter your response...
TRANSLATION:

KEY: meeting:request_send_response
EN: Send Response
TRANSLATION:

KEY: meeting:request_recognized
EN: The chair has recognized your {{type}}.
TRANSLATION:

KEY: meeting:request_awaiting_response
EN:  Awaiting the chair's response.
TRANSLATION:

KEY: meeting:request_clear
EN: Clear
TRANSLATION:

KEY: meeting:quorum_set_title
EN: Set Minimum Quorum
TRANSLATION:

KEY: meeting:quorum_specific_number
EN: Specific Number
TRANSLATION:

KEY: meeting:quorum_fraction_label
EN: Fraction of Members
TRANSLATION:

KEY: meeting:quorum_majority
EN: Majority (more than half)
TRANSLATION:

KEY: meeting:quorum_one_third
EN: One-third
TRANSLATION:

KEY: meeting:quorum_two_thirds
EN: Two-thirds
TRANSLATION:

KEY: meeting:quorum_set_button
EN: Set Quorum
TRANSLATION:

KEY: meeting:quorum_set_tooltip
EN: Set the minimum attendance required to conduct business
TRANSLATION:

KEY: meeting:decided_title
EN: Decided Motions ({{count}})
TRANSLATION:

KEY: meeting:decided_adopted
EN: Adopted
TRANSLATION:

KEY: meeting:decided_defeated
EN: Defeated
TRANSLATION:

KEY: meeting:tabled_title
EN: Tabled Motions ({{count}})
TRANSLATION:

KEY: meeting:tabled_at
EN: Tabled at {{time}}
TRANSLATION:

KEY: meeting:rule_in_order
EN: In Order
TRANSLATION:

KEY: meeting:rule_out_of_order
EN: Out of Order
TRANSLATION:

KEY: meeting:rule_second_required
EN: Second Required
TRANSLATION:

KEY: meeting:rule_no_second
EN: No Second
TRANSLATION:

KEY: meeting:rule_debatable
EN: Debatable
TRANSLATION:

KEY: meeting:rule_not_debatable
EN: Not Debatable
TRANSLATION:

KEY: meeting:rule_amendable
EN: Amendable
TRANSLATION:

KEY: meeting:rule_not_amendable
EN: Not Amendable
TRANSLATION:

KEY: meeting:rule_majority_vote
EN: Majority Vote
TRANSLATION:

KEY: meeting:rule_two_thirds_vote
EN: 2/3 Vote
TRANSLATION:

KEY: meeting:rule_no_vote
EN: No Vote
TRANSLATION:

KEY: meeting:rule_tie_sustains
EN: Tie Sustains Chair
TRANSLATION:

KEY: meeting:rule_may_interrupt
EN: May Interrupt
TRANSLATION:

KEY: meeting:skip_to_content
EN: Skip to main content
TRANSLATION:

KEY: meeting:based_on_ronr
EN: Based on Robert's Rules of Order
TRANSLATION:

KEY: meeting:alert_active_chair
EN: A meeting is already in progress with an active Chair. Please join as a participant or wait for it to end.
TRANSLATION:

KEY: meeting:alert_no_meeting
EN: No active meeting found. Please wait for the Chair to start the meeting.
TRANSLATION:

KEY: meeting:alert_name_in_use
EN: The name "{{name}}" is already in use by an active participant. Please choose a different name.
TRANSLATION:

KEY: meeting:log_meeting_created
EN: Meeting created by {{name}}
TRANSLATION:

KEY: meeting:log_joined_as
EN: {{name}} joined as {{role}}
TRANSLATION:

KEY: meeting:log_called_to_order
EN: Meeting called to order
TRANSLATION:

KEY: meeting:log_quorum_set
EN: Quorum set to {{rule}} ({{count}} members required).
TRANSLATION:

KEY: meeting:log_roll_call_complete_quorum
EN: Roll call complete. {{present}} of {{total}} members present. Quorum requirement: {{required}}. {{status}}
TRANSLATION:

KEY: meeting:log_roll_call_complete
EN: Roll call complete. {{present}} of {{total}} members present. Quorum established.
TRANSLATION:

KEY: meeting:log_quorum_established
EN: Quorum established.
TRANSLATION:

KEY: meeting:log_quorum_not_met
EN: QUORUM NOT MET.
TRANSLATION:

KEY: meeting:log_no_quorum
EN: Meeting cannot proceed without a quorum. Meeting adjourned.
TRANSLATION:

KEY: meeting:log_called_for_roll
EN: {{name}} called for roll.
TRANSLATION:

KEY: meeting:log_present
EN: {{name}}: Present.
TRANSLATION:

KEY: meeting:log_present_confirmed
EN: {{name}}: Present (confirmed by {{confirmedBy}}).
TRANSLATION:

KEY: meeting:log_minutes_approved_adopt_agenda
EN: Minutes approved. Proceeding to adopt the agenda.
TRANSLATION:

KEY: meeting:log_minutes_approved_agenda
EN: Minutes approved. Proceeding to the first agenda item.
TRANSLATION:

KEY: meeting:log_minutes_approved_new_business
EN: Minutes approved. Proceeding to New Business.
TRANSLATION:

KEY: meeting:log_agenda_adopted
EN: Agenda adopted. Proceeding to first agenda item.
TRANSLATION:

KEY: meeting:log_agenda_complete
EN: Concluded agenda item: "{{title}}". All agenda items complete. Proceeding to New Business.
TRANSLATION:

KEY: meeting:log_agenda_next
EN: Concluded agenda item: "{{title}}". Moving to next item.
TRANSLATION:

KEY: meeting:log_motion_not_in_order
EN: Motion not in order: {{error}}
TRANSLATION:

KEY: meeting:log_motion_moved
EN: {{name}} moved: "{{text}}"
TRANSLATION:

KEY: meeting:log_chair_recognizes
EN: The chair recognizes the motion: "{{name}}". Is there a second?
TRANSLATION:

KEY: meeting:log_ruled_out_of_order
EN: The chair rules the motion "{{text}}" out of order.
TRANSLATION:

KEY: meeting:log_chair_confirmed_second
EN: The chair confirmed a second for: {{name}}.{{debateNote}}
TRANSLATION:

KEY: meeting:log_seconded_by
EN: {{name}} seconded by {{seconder}}.{{debateNote}}
TRANSLATION:

KEY: meeting:log_floor_open
EN:  Floor is open for discussion.
TRANSLATION:

KEY: meeting:log_proceed_vote
EN:  Proceeding to vote (not debatable).
TRANSLATION:

KEY: meeting:log_no_second
EN: The motion "{{text}}" falls for lack of a second.
TRANSLATION:

KEY: meeting:log_motion_out_of_order_priority
EN: {{name}} is out of order: a higher or equal priority motion is already pending.
TRANSLATION:

KEY: meeting:log_motion_queued
EN: {{name}} proposes: {{motionName}} - "{{text}}" (queued — speaker has the floor)
TRANSLATION:

KEY: meeting:log_motion_moves
EN: {{name}} moves: {{motionName}} - "{{text}}"
TRANSLATION:

KEY: meeting:log_no_pending_motion
EN: No pending motion found at that index.
TRANSLATION:

KEY: meeting:log_motion_create_error
EN: Could not create motion: {{error}}
TRANSLATION:

KEY: meeting:log_chair_recognize_error
EN: Chair could not recognize {{name}}: {{error}}
TRANSLATION:

KEY: meeting:log_chair_recognizes_pending
EN: Chair recognizes {{motionName}} by {{proposer}}: "{{text}}". Is there a second?
TRANSLATION:

KEY: meeting:log_chair_declines_pending
EN: Chair declines {{motionName}} by {{proposer}}
TRANSLATION:

KEY: meeting:log_calls_question
EN: The chair calls the question on: {{name}}. All in favor?
TRANSLATION:

KEY: meeting:log_voted
EN: {{name}} voted
TRANSLATION:

KEY: meeting:log_vote_result
EN: Vote result: {{aye}} ayes, {{nay}} nays ({{threshold}} required). Motion {{result}}.
TRANSLATION:

KEY: meeting:carried
EN: CARRIED
TRANSLATION:

KEY: meeting:failed
EN: FAILED
TRANSLATION:

KEY: meeting:log_minutes_correction_vote
EN: Vote on minutes correction: {{aye}} ayes, {{nay}} nays. The correction {{result}}.
TRANSLATION:

KEY: meeting:log_vote_on
EN: Vote on {{motionName}}: {{description}}: "{{text}}"
TRANSLATION:

KEY: meeting:log_pending_auto_dismissed
EN: Pending motions auto-dismissed (object no longer exists): {{names}}
TRANSLATION:

KEY: meeting:log_pending_auto_dismissed_no_question
EN: Pending motions auto-dismissed (no pending question): {{names}}
TRANSLATION:

KEY: meeting:log_amendment_adopted
EN: Amendment adopted. Debate continues on the motion as amended.
TRANSLATION:

KEY: meeting:log_previous_question_ordered
EN: Previous question ordered. Debate is closed. Proceeding to immediate vote.
TRANSLATION:

KEY: meeting:log_laid_on_table
EN: Motion laid on the table: "{{text}}"
TRANSLATION:

KEY: meeting:log_reformulates
EN: {{name}} reformulates the motion: "{{text}}"
TRANSLATION:

KEY: meeting:log_motion_withdrawn
EN: Motion withdrawn: "{{text}}"
TRANSLATION:

KEY: meeting:log_rules_resumed
EN: Rules resumed.
TRANSLATION:

KEY: meeting:log_chair_calls_vote
EN: The chair calls a vote ({{threshold}} required).
TRANSLATION:

KEY: meeting:log_new_speaking_list
EN: The chair opens a new temporary speaking list.
TRANSLATION:

KEY: meeting:log_temp_speaking_list
EN: The chair opens a temporary speaking list (previous list paused).
TRANSLATION:

KEY: meeting:log_resume_speaking_list
EN: The chair resumes the previous speaking list.
TRANSLATION:

KEY: meeting:log_resumed_from_recess
EN: Meeting resumed from recess.
TRANSLATION:

KEY: meeting:log_continues_debate
EN: Chair continues debate on the pending question.
TRANSLATION:

KEY: meeting:log_continues_agenda_item
EN: Chair continues with the current agenda item.
TRANSLATION:

KEY: meeting:log_proceeded_new_business
EN: Chair proceeded to New Business.
TRANSLATION:

KEY: meeting:log_meeting_adjourned
EN: Meeting adjourned
TRANSLATION:

KEY: meeting:log_recognizes_amendment
EN: Chair recognizes amendment by {{name}}: "{{text}}". Is there a second?
TRANSLATION:

KEY: meeting:log_declines_amendment
EN: Chair declines to recognize amendment from {{name}}
TRANSLATION:

KEY: meeting:log_proposes_correction
EN: {{name}} proposes correction to minutes: {{text}}
TRANSLATION:

KEY: meeting:log_objection_to_correction
EN: Objection raised to minutes correction. The correction is now before the assembly.
TRANSLATION:

KEY: meeting:log_correction_by_consent
EN: Minutes corrected by consent: {{text}}
TRANSLATION:

KEY: meeting:log_chair_rules_point
EN: Chair rules: {{ruling}}. Point of order by {{name}} {{result}}.
TRANSLATION:

KEY: meeting:sustained
EN: SUSTAINED
TRANSLATION:

KEY: meeting:not_sustained
EN: NOT SUSTAINED
TRANSLATION:

KEY: meeting:log_correction_vote
EN: The chair puts the minutes correction to a vote.
TRANSLATION:

KEY: meeting:log_raises_incidental
EN: {{name}} raises: {{type}}
TRANSLATION:

KEY: meeting:log_chair_left_vice
EN: Chair {{chair}} has left. Vice Chair {{vice}} assumes the chair.
TRANSLATION:

KEY: meeting:log_chair_left_adjourned
EN: Chair {{name}} has left. No members remain. Meeting automatically adjourned.
TRANSLATION:

KEY: meeting:log_chair_left_random
EN: Chair {{chair}} has left. {{newChair}} has been randomly selected as Chair.
TRANSLATION:

KEY: meeting:log_left_meeting
EN: {{name}} has left the meeting.
TRANSLATION:

KEY: meeting:log_calls_orders
EN: {{name}} calls for the Orders of the Day
TRANSLATION:

KEY: meeting:log_returns_to_orders
EN: Chair returns to the Orders of the Day
TRANSLATION:

KEY: meeting:log_suspend_to_continue
EN: Chair moves to suspend the rules to continue with current business (requires 2/3 vote). Is there a second?
TRANSLATION:

KEY: meeting:log_returns_to_orders_unable
EN: Chair returns to the Orders of the Day (unable to initiate suspend the rules)
TRANSLATION:

KEY: meeting:confirm_clear_meeting
EN: Are you sure you want to clear all meeting data? This will end the meeting for all participants.
TRANSLATION:

KEY: meeting:log_postponed_until
EN: Motion postponed until {{time}}: "{{text}}"
TRANSLATION:

KEY: meeting:a_later_time
EN: a later time
TRANSLATION:

KEY: meeting:log_referred_to
EN: Motion referred to {{committee}}: "{{text}}"
TRANSLATION:

KEY: meeting:committee
EN: committee
TRANSLATION:

KEY: meeting:log_postponed_indefinitely
EN: Motion postponed indefinitely (killed).
TRANSLATION:

KEY: meeting:log_debate_limits_adopted
EN: Debate limits adopted and applied.
TRANSLATION:

KEY: meeting:log_adjourn_adopted
EN: Motion to adjourn adopted. Meeting adjourned.
TRANSLATION:

KEY: meeting:log_recess
EN: Meeting in recess for {{duration}} minutes.
TRANSLATION:

KEY: meeting:log_rules_suspended
EN: Rules suspended: "{{purpose}}"
TRANSLATION:

KEY: meeting:log_taken_from_table
EN: Motion taken from the table: "{{text}}"
TRANSLATION:

KEY: meeting:log_cannot_reconsider
EN: {{name}} cannot move to reconsider: only members who voted on the prevailing side ({{side}}) may do so.
TRANSLATION:

KEY: meeting:log_moves_to_reconsider
EN: {{name}} moves to reconsider: "{{text}}"
TRANSLATION:

KEY: meeting:log_request_to_speak
EN: {{name}} requested to speak ({{stance}})
TRANSLATION:

KEY: meeting:log_chair_recognizes_speaker
EN: The chair recognizes {{name}}
TRANSLATION:

KEY: meeting:log_yields_floor
EN: {{name}} yields the floor
TRANSLATION:

KEY: meeting:log_temp_list_completed
EN: Temporary speaking list completed. Resuming previous list.
TRANSLATION:

KEY: meeting:log_raises_request
EN: {{name}} raises: {{type}}{{content}}
TRANSLATION:

KEY: meeting:log_chair_accepts
EN: Chair accepts {{type}} from {{name}}
TRANSLATION:

KEY: meeting:log_chair_responds
EN: Chair responds to {{type}}: "{{response}}"
TRANSLATION:

KEY: meeting:log_request_dismissed
EN: Request dismissed
TRANSLATION:

KEY: meeting:log_motion_queued_member
EN: {{name}} moves: {{motionName}} - "{{text}}" (queued — a member has the floor)
TRANSLATION:

KEY: meeting:log_motion_recognize_error
EN: Motion could not be recognized: {{error}}
TRANSLATION:

## motions (35 keys)

KEY: motions:display_main
EN: Main Motion
TRANSLATION:

KEY: motions:display_main_incidental
EN: Incidental Main Motion
TRANSLATION:

KEY: motions:display_postpone_indefinitely
EN: Postpone Indefinitely
TRANSLATION:

KEY: motions:display_amend
EN: Amend
TRANSLATION:

KEY: motions:display_commit
EN: Refer to Committee
TRANSLATION:

KEY: motions:display_postpone_definitely
EN: Postpone to a Definite Time
TRANSLATION:

KEY: motions:display_limit_debate
EN: Limit/Extend Debate
TRANSLATION:

KEY: motions:display_previous_question
EN: Previous Question (Close Debate)
TRANSLATION:

KEY: motions:display_lay_on_table
EN: Lay on the Table
TRANSLATION:

KEY: motions:display_orders_of_day
EN: Call for Orders of the Day
TRANSLATION:

KEY: motions:display_question_of_privilege
EN: Question of Privilege
TRANSLATION:

KEY: motions:display_recess
EN: Recess
TRANSLATION:

KEY: motions:display_adjourn
EN: Adjourn
TRANSLATION:

KEY: motions:display_fix_time_to_adjourn
EN: Fix the Time to Which to Adjourn
TRANSLATION:

KEY: motions:display_point_of_order
EN: Point of Order
TRANSLATION:

KEY: motions:display_appeal
EN: Appeal the Decision of the Chair
TRANSLATION:

KEY: motions:display_parliamentary_inquiry
EN: Parliamentary Inquiry
TRANSLATION:

KEY: motions:display_request_for_info
EN: Request for Information
TRANSLATION:

KEY: motions:display_division_of_assembly
EN: Division of the Assembly
TRANSLATION:

KEY: motions:display_suspend_rules
EN: Suspend the Rules
TRANSLATION:

KEY: motions:display_withdraw_motion
EN: Withdraw a Motion
TRANSLATION:

KEY: motions:display_objection_to_consideration
EN: Objection to Consideration
TRANSLATION:

KEY: motions:display_take_from_table
EN: Take from the Table
TRANSLATION:

KEY: motions:display_reconsider
EN: Reconsider
TRANSLATION:

KEY: motions:display_rescind
EN: Rescind/Amend Something Previously Adopted
TRANSLATION:

KEY: motions:status_pending_chair
EN: Pending Chair
TRANSLATION:

KEY: motions:status_pending_second
EN: Awaiting Second
TRANSLATION:

KEY: motions:status_debating
EN: Under Debate
TRANSLATION:

KEY: motions:status_voting
EN: Voting
TRANSLATION:

KEY: motions:status_adopted
EN: Adopted
TRANSLATION:

KEY: motions:status_defeated
EN: Defeated
TRANSLATION:

KEY: motions:status_withdrawn
EN: Withdrawn
TRANSLATION:

KEY: motions:status_tabled
EN: Tabled
TRANSLATION:

KEY: motions:status_postponed
EN: Postponed
TRANSLATION:

KEY: motions:status_committed
EN: Committed
TRANSLATION:

## guidance (85 keys)

KEY: guidance:chair_guidance_label
EN: Chair Guidance: {{title}}
TRANSLATION:

KEY: guidance:individual_votes
EN: Individual Votes:
TRANSLATION:

KEY: guidance:vote_aye
EN: Aye
TRANSLATION:

KEY: guidance:vote_nay
EN: Nay
TRANSLATION:

KEY: guidance:vote_abstain
EN: Abstain
TRANSLATION:

KEY: guidance:title_announce_result
EN: Announce the Result
TRANSLATION:

KEY: guidance:title_call_to_order
EN: Call to Order
TRANSLATION:

KEY: guidance:title_roll_call
EN: Roll Call
TRANSLATION:

KEY: guidance:title_minutes_corrections
EN: Minutes Corrections
TRANSLATION:

KEY: guidance:title_approval_of_minutes
EN: Approval of Minutes
TRANSLATION:

KEY: guidance:title_adopt_agenda
EN: Adopt the Agenda
TRANSLATION:

KEY: guidance:title_new_business
EN: New Business
TRANSLATION:

KEY: guidance:title_motion_awaiting_second
EN: Motion Awaiting Second
TRANSLATION:

KEY: guidance:title_orders_of_the_day
EN: Orders of the Day
TRANSLATION:

KEY: guidance:title_motion_pending_recognition
EN: Motion Pending Recognition
TRANSLATION:

KEY: guidance:title_pending_amendment
EN: Pending Amendment
TRANSLATION:

KEY: guidance:title_member_speaking
EN: Member Speaking
TRANSLATION:

KEY: guidance:title_recognize_next_speaker
EN: Recognize Next Speaker
TRANSLATION:

KEY: guidance:title_not_debatable
EN: {{motionName}} - Not Debatable
TRANSLATION:

KEY: guidance:title_ready_for_question
EN: Ready for the Question
TRANSLATION:

KEY: guidance:title_vote_on
EN: Vote on {{motionName}}
TRANSLATION:

KEY: guidance:title_announce_result_short
EN: Announce Result
TRANSLATION:

KEY: guidance:title_meeting_in_recess
EN: Meeting in Recess
TRANSLATION:

KEY: guidance:title_meeting_adjourned
EN: Meeting Adjourned
TRANSLATION:

KEY: guidance:title_awaiting_second
EN: {{motionName}} Awaiting Second
TRANSLATION:

KEY: guidance:title_agenda_item
EN: Agenda Item {{index}}: {{title}}
TRANSLATION:

KEY: guidance:phrase_call_to_order
EN: The meeting will come to order.
TRANSLATION:

KEY: guidance:phrase_roll_call
EN: The Secretary will call the roll.
TRANSLATION:

KEY: guidance:phrase_minutes_correction
EN: A correction to the minutes has been proposed. Is there any objection?
TRANSLATION:

KEY: guidance:phrase_minutes_no_corrections
EN: Are there any corrections to the minutes?
TRANSLATION:

KEY: guidance:phrase_adopt_agenda
EN: The proposed agenda contains {{count}} item{{plural}}. Is there a motion to adopt the agenda as presented?
TRANSLATION:

KEY: guidance:phrase_agenda_report
EN: The chair recognizes {{owner}} for a report on "{{title}}".
TRANSLATION:

KEY: guidance:phrase_agenda_report_no_owner
EN: The next item of business is a report: "{{title}}".
TRANSLATION:

KEY: guidance:phrase_agenda_motion
EN: The next item of business is "{{title}}". Is there a motion?
TRANSLATION:

KEY: guidance:phrase_new_business
EN: Is there any new business?
TRANSLATION:

KEY: guidance:phrase_moved_second
EN: It has been moved: "{{text}}". Is there a second?
TRANSLATION:

KEY: guidance:phrase_moved_that_second
EN: It has been moved that "{{text}}". Is there a second?
TRANSLATION:

KEY: guidance:phrase_orders_of_day
EN: A member has called for the Orders of the Day. The chair must either return to the prescribed order of business or put the question: 'Shall the assembly suspend the rules and continue with the current business?' (requires 2/3 vote)
TRANSLATION:

KEY: guidance:phrase_motion_pending
EN: A motion has been made by {{mover}}: "{{text}}". Is there a second?
TRANSLATION:

KEY: guidance:phrase_pending_amendment
EN: The chair recognizes {{proposer}} to propose an amendment.
TRANSLATION:

KEY: guidance:phrase_member_speaking
EN: The chair has recognized {{name}}.
TRANSLATION:

KEY: guidance:phrase_recognize_next
EN: The chair recognizes {{name}}.
TRANSLATION:

KEY: guidance:phrase_not_debatable
EN: The question is on {{motionName}}: "{{text}}".
TRANSLATION:

KEY: guidance:phrase_ready_question
EN: Are there any further speakers? [Pause] Hearing none, {{question}}
TRANSLATION:

KEY: guidance:phrase_ready_question_motion
EN: Are you ready for the question on {{motionName}}?
TRANSLATION:

KEY: guidance:phrase_ready_question_default
EN: Are there any further speakers?
TRANSLATION:

KEY: guidance:phrase_vote
EN: The question is on {{motionName}}: "{{text}}". All in favor, say aye. [Pause] All opposed, say no.
TRANSLATION:

KEY: guidance:phrase_all_voted
EN: All votes have been cast.
TRANSLATION:

KEY: guidance:phrase_all_voted_chair
EN: All members have voted. The chair may vote or announce the result.
TRANSLATION:

KEY: guidance:phrase_recess
EN: The meeting is in recess.
TRANSLATION:

KEY: guidance:phrase_adjourned
EN: The meeting is adjourned.
TRANSLATION:

KEY: guidance:phrase_adopted_amendment
EN: The ayes have it and the amendment is adopted. Discussion continues on the motion as amended: "{{text}}".
TRANSLATION:

KEY: guidance:phrase_adopted_more
EN: The ayes have it and the {{motionName}} is adopted. Debate continues on the pending question.
TRANSLATION:

KEY: guidance:phrase_adopted_final
EN: The ayes have it and the motion is adopted: "{{text}}". Is there further business?
TRANSLATION:

KEY: guidance:phrase_defeated_amendment
EN: The amendment is lost. Discussion continues on the main motion: "{{text}}".
TRANSLATION:

KEY: guidance:phrase_defeated_more
EN: The nays have it and the {{motionName}} is lost. Debate continues on the pending question.
TRANSLATION:

KEY: guidance:phrase_defeated_final
EN: The nays have it and the motion is lost. Is there further business?
TRANSLATION:

KEY: guidance:action_call_to_order
EN: Click 'Call Meeting to Order' when ready.
TRANSLATION:

KEY: guidance:action_roll_call_secretary
EN: Call each member's name. They will respond 'Present.'
TRANSLATION:

KEY: guidance:action_roll_call_chair
EN: The Secretary is conducting roll call.
TRANSLATION:

KEY: guidance:action_minutes_correction
EN: If no objection, the minutes are corrected by unanimous consent. If a member objects, the correction is debated and put to a vote.
TRANSLATION:

KEY: guidance:action_minutes_no_corrections
EN: Pause for corrections. If none are offered: 'Hearing no corrections, the minutes stand approved as distributed.' If corrections are proposed, handle them before approving.
TRANSLATION:

KEY: guidance:action_adopt_agenda
EN: Adopt by unanimous consent or entertain a motion to adopt.
TRANSLATION:

KEY: guidance:action_agenda_report
EN: After the report, ask if there are questions. When done, advance to the next item.
TRANSLATION:

KEY: guidance:action_agenda_motion
EN: Wait for a member to make a motion, or advance to the next item if no action is needed.
TRANSLATION:

KEY: guidance:action_new_business
EN: Wait for members to make motions, or adjourn if business is complete.
TRANSLATION:

KEY: guidance:action_wait_second
EN: Wait for a member to second.
TRANSLATION:

KEY: guidance:action_wait_second_required
EN: Wait for a member to second. {{extra}}
TRANSLATION:

KEY: guidance:action_second_required
EN: A second is required.
TRANSLATION:

KEY: guidance:action_wait_second_motion
EN: Wait for a member to second the motion.
TRANSLATION:

KEY: guidance:action_orders_of_day
EN: Choose to comply or move to suspend the rules.
TRANSLATION:

KEY: guidance:action_recognize_or_reject
EN: Decide whether to recognize this motion or rule it out of order.
TRANSLATION:

KEY: guidance:action_recognize_amendment
EN: Click 'Recognize Amendment' to hear the amendment, or 'Decline' to proceed with debate.
TRANSLATION:

KEY: guidance:action_member_speaking
EN: Allow the member to speak. When finished, they will yield the floor.
TRANSLATION:

KEY: guidance:action_recognize_next
EN: Click 'Recognize Next Speaker' to give them the floor.
TRANSLATION:

KEY: guidance:action_not_debatable
EN: This motion is not debatable. {{threshold}} required. Call the question to vote.
TRANSLATION:

KEY: guidance:action_ready_question
EN: If no one requests to speak, call the question. {{threshold}} required to adopt.
TRANSLATION:

KEY: guidance:action_ready_question_default
EN: If no one requests to speak, click 'Call the Question (Vote)' to proceed to voting.
TRANSLATION:

KEY: guidance:action_vote
EN: {{threshold}} required. Abstentions do not count. Wait for all members to vote, then click 'Announce Result'.
TRANSLATION:

KEY: guidance:action_announce_result
EN: {{threshold}} required. Click 'Announce Result' to declare the outcome.
TRANSLATION:

KEY: guidance:action_recess
EN: Click 'Resume Meeting' when the recess period has ended.
TRANSLATION:

KEY: guidance:action_adjourned
EN: The meeting has concluded.
TRANSLATION:

KEY: guidance:action_vote_count
EN: The vote was {{aye}} ayes, {{nay}} nays. {{threshold}} was required.
TRANSLATION:

KEY: guidance:button_continue_debate
EN: Continue Debate
TRANSLATION:

KEY: guidance:button_proceed_new_business
EN: Proceed to New Business
TRANSLATION:

## actions (107 keys)

KEY: actions:button_call_to_order
EN: Call Meeting to Order
TRANSLATION:

KEY: actions:button_complete_roll_call
EN: Complete Roll Call
TRANSLATION:

KEY: actions:button_approve_minutes
EN: Approve Minutes
TRANSLATION:

KEY: actions:button_adopt_agenda
EN: Adopt Agenda
TRANSLATION:

KEY: actions:button_next_agenda_item
EN: Next Agenda Item
TRANSLATION:

KEY: actions:button_conclude_agenda
EN: Conclude Agenda
TRANSLATION:

KEY: actions:button_resume_meeting
EN: Resume Meeting
TRANSLATION:

KEY: actions:button_return_orders
EN: Return to Orders of the Day
TRANSLATION:

KEY: actions:button_move_suspend
EN: Move to Suspend the Rules
TRANSLATION:

KEY: actions:button_recognize_motion
EN: Recognize Motion
TRANSLATION:

KEY: actions:button_rule_out_of_order
EN: Rule Out of Order
TRANSLATION:

KEY: actions:button_confirm_second
EN: Confirm Second (oral)
TRANSLATION:

KEY: actions:button_no_second
EN: No Second — Motion Falls
TRANSLATION:

KEY: actions:button_speaker_yields
EN: Speaker Yields Floor
TRANSLATION:

KEY: actions:button_call_vote
EN: Call the Vote
TRANSLATION:

KEY: actions:button_call_vote_suspended
EN: Call Vote
TRANSLATION:

KEY: actions:button_adjourn
EN: Adjourn Meeting
TRANSLATION:

KEY: actions:button_new_speaking_list
EN: New Speaking List
TRANSLATION:

KEY: actions:button_resume_previous_list
EN: Resume Previous List
TRANSLATION:

KEY: actions:button_recognize_next
EN: Recognize Next Speaker
TRANSLATION:

KEY: actions:button_resume_regular_rules
EN: Resume Regular Rules
TRANSLATION:

KEY: actions:button_original_motion
EN: Original Motion
TRANSLATION:

KEY: actions:button_incidental
EN: Incidental
TRANSLATION:

KEY: actions:button_second
EN: Second: {{motion}}
TRANSLATION:

KEY: actions:button_second_default
EN: Second: the Motion
TRANSLATION:

KEY: actions:button_speak_favor
EN: Speak in Favor
TRANSLATION:

KEY: actions:button_speak_against
EN: Speak Against
TRANSLATION:

KEY: actions:button_yield_floor
EN: Yield Floor
TRANSLATION:

KEY: actions:button_propose_amendment
EN: Propose Amendment
TRANSLATION:

KEY: actions:button_withdraw_reformulate
EN: Withdraw / Reformulate
TRANSLATION:

KEY: actions:button_withdraw_motion
EN: Withdraw Motion
TRANSLATION:

KEY: actions:button_orders_of_day
EN: Orders of the Day
TRANSLATION:

KEY: actions:button_point_of_order
EN: Point of Order
TRANSLATION:

KEY: actions:button_parl_inquiry
EN: Parl. Inquiry
TRANSLATION:

KEY: actions:button_request_info
EN: Request Info
TRANSLATION:

KEY: actions:button_appeal_chair
EN: Appeal Chair
TRANSLATION:

KEY: actions:button_division
EN: Division
TRANSLATION:

KEY: actions:button_suspend_rules
EN: Suspend Rules
TRANSLATION:

KEY: actions:summary_bring_back
EN: Bring Back Motions ({{count}})
TRANSLATION:

KEY: actions:summary_subsidiary
EN: Subsidiary Motions ({{count}})
TRANSLATION:

KEY: actions:summary_privileged
EN: Privileged Motions ({{count}})
TRANSLATION:

KEY: actions:summary_incidental
EN: Incidental Motions
TRANSLATION:

KEY: actions:label_interrupts
EN: Interrupts
TRANSLATION:

KEY: actions:label_majority
EN: Majority
TRANSLATION:

KEY: actions:label_two_thirds
EN: Two-Thirds
TRANSLATION:

KEY: actions:label_unanimous
EN: Unanimous
TRANSLATION:

KEY: actions:appeal_window
EN: Appeal window ({{count}}s remaining)
TRANSLATION:

KEY: actions:confirm_adjourn
EN: Are you sure you want to adjourn the meeting?
TRANSLATION:

KEY: actions:tooltip_call_to_order
EN: Officially begin the meeting
TRANSLATION:

KEY: actions:tooltip_complete_roll_call
EN: Confirm attendance and establish quorum
TRANSLATION:

KEY: actions:tooltip_complete_roll_call_no_quorum
EN: Set a quorum requirement first (see Members drawer)
TRANSLATION:

KEY: actions:tooltip_approve_minutes
EN: Accept the minutes of the last meeting as correct
TRANSLATION:

KEY: actions:tooltip_adopt_agenda
EN: Adopt the proposed agenda as the order of business
TRANSLATION:

KEY: actions:tooltip_next_agenda
EN: Move to the next agenda item
TRANSLATION:

KEY: actions:tooltip_conclude_agenda
EN: Conclude the last agenda item and proceed to New Business
TRANSLATION:

KEY: actions:tooltip_resume_recess
EN: End the break and continue the meeting
TRANSLATION:

KEY: actions:tooltip_recognize_motion
EN: Recognize this motion and open it for a second
TRANSLATION:

KEY: actions:tooltip_appeal_wait
EN: Wait for appeal window to expire
TRANSLATION:

KEY: actions:tooltip_reject_motion
EN: Rule this motion out of order
TRANSLATION:

KEY: actions:tooltip_confirm_second
EN: Confirm someone verbally seconded the motion
TRANSLATION:

KEY: actions:tooltip_no_second
EN: Declare no one seconded — the motion dies
TRANSLATION:

KEY: actions:tooltip_speaker_yields
EN: End the current speaker's time
TRANSLATION:

KEY: actions:tooltip_call_vote
EN: End debate and put the motion to a vote
TRANSLATION:

KEY: actions:tooltip_call_vote_suspended
EN: Put the matter to a vote
TRANSLATION:

KEY: actions:tooltip_adjourn
EN: End the meeting
TRANSLATION:

KEY: actions:tooltip_new_speaking_list
EN: Start a temporary speaking list
TRANSLATION:

KEY: actions:tooltip_resume_previous_list
EN: Resume the previous speaking list
TRANSLATION:

KEY: actions:tooltip_recognize_next
EN: Give the floor to the next person in queue
TRANSLATION:

KEY: actions:tooltip_resume_regular_rules
EN: Return to normal parliamentary procedure
TRANSLATION:

KEY: actions:tooltip_original_motion
EN: Propose a new item for the group to consider
TRANSLATION:

KEY: actions:tooltip_incidental_main
EN: Propose procedural business (e.g. adopt rules)
TRANSLATION:

KEY: actions:tooltip_second_motion
EN: Support putting this motion up for discussion
TRANSLATION:

KEY: actions:tooltip_speak_favor
EN: Join the queue to speak in support
TRANSLATION:

KEY: actions:tooltip_speak_against
EN: Join the queue to speak in opposition
TRANSLATION:

KEY: actions:tooltip_yield_floor
EN: Finish speaking and return the floor to the chair
TRANSLATION:

KEY: actions:tooltip_propose_amendment
EN: Change the wording of the motion before voting
TRANSLATION:

KEY: actions:tooltip_propose_amendment_disabled
EN: Change the wording of the motion before voting — OUT OF ORDER: {{reason}}
TRANSLATION:

KEY: actions:tooltip_pre_chair_withdraw
EN: Take back or revise your motion (no vote needed — chair hasn't accepted yet)
TRANSLATION:

KEY: actions:tooltip_point_of_order
EN: Alert the chair that a rule is being broken
TRANSLATION:

KEY: actions:tooltip_point_of_order_pending
EN: A point of order is already pending
TRANSLATION:

KEY: actions:tooltip_parl_inquiry
EN: Ask the chair a question about procedure
TRANSLATION:

KEY: actions:tooltip_request_info
EN: Ask a factual question relevant to the discussion
TRANSLATION:

KEY: actions:tooltip_appeal_enabled
EN: Challenge the chair's ruling — the group decides
TRANSLATION:

KEY: actions:tooltip_appeal_disabled
EN: No recent chair ruling to appeal
TRANSLATION:

KEY: actions:tooltip_division_enabled
EN: Request a counted vote instead of a voice vote
TRANSLATION:

KEY: actions:tooltip_division_disabled
EN: Division can only be demanded during voting
TRANSLATION:

KEY: actions:tooltip_suspend_rules
EN: Temporarily set aside the rules (requires 2/3 vote)
TRANSLATION:

KEY: actions:tooltip_withdraw_motion
EN: Request to take back your motion (requires consent)
TRANSLATION:

KEY: actions:tooltip_orders_of_day
EN: Demand the assembly return to the prescribed order of business
TRANSLATION:

KEY: actions:tooltip_postpone_indefinitely
EN: Kill the motion without a direct vote on it
TRANSLATION:

KEY: actions:tooltip_amend
EN: Change the wording of the motion before voting
TRANSLATION:

KEY: actions:tooltip_commit
EN: Send the motion to a smaller group for study
TRANSLATION:

KEY: actions:tooltip_postpone_definitely
EN: Delay the motion to a specific time
TRANSLATION:

KEY: actions:tooltip_limit_debate
EN: Set a time limit or speaker limit on debate
TRANSLATION:

KEY: actions:tooltip_previous_question
EN: End debate and vote immediately
TRANSLATION:

KEY: actions:tooltip_lay_on_table
EN: Set aside the motion temporarily for urgent business
TRANSLATION:

KEY: actions:tooltip_orders_of_day_priv
EN: Require the group to follow the agenda
TRANSLATION:

KEY: actions:tooltip_question_privilege
EN: Address an urgent matter affecting the assembly
TRANSLATION:

KEY: actions:tooltip_recess
EN: Take a short break
TRANSLATION:

KEY: actions:tooltip_adjourn_priv
EN: End the meeting
TRANSLATION:

KEY: actions:tooltip_fix_time
EN: Set when the next meeting will be
TRANSLATION:

KEY: actions:tooltip_take_from_table
EN: Resume a motion that was set aside earlier
TRANSLATION:

KEY: actions:tooltip_reconsider
EN: Reopen a motion that was already voted on
TRANSLATION:

KEY: actions:tooltip_rescind
EN: Cancel or reverse a previously adopted motion
TRANSLATION:

KEY: actions:out_of_order
EN: OUT OF ORDER
TRANSLATION:

KEY: actions:out_of_order_reason
EN: OUT OF ORDER: {{reason}}
TRANSLATION:

KEY: actions:higher_priority_pending
EN: A higher or equal priority motion is already pending
TRANSLATION:

## modals (147 keys)

KEY: modals:motion_heading
EN: Introduce a Motion
TRANSLATION:

KEY: modals:motion_desc
EN: Original main motion — introduces new business before the assembly.
TRANSLATION:

KEY: modals:motion_label
EN: Motion Text
TRANSLATION:

KEY: modals:motion_placeholder
EN: I move that...
TRANSLATION:

KEY: modals:motion_special_types
EN: Special types of original main motions
TRANSLATION:

KEY: modals:motion_previous_notice
EN: Requires previous notice
TRANSLATION:

KEY: modals:motion_previous_notice_tag
EN: requires previous notice
TRANSLATION:

KEY: modals:motion_cancel
EN: Cancel
TRANSLATION:

KEY: modals:motion_submit
EN: Introduce Motion
TRANSLATION:

KEY: modals:amendment_heading
EN: Amend the Motion
TRANSLATION:

KEY: modals:amendment_desc
EN: Subsidiary motion — proposes a change to the pending question.
TRANSLATION:

KEY: modals:amendment_original
EN: Original Motion:
TRANSLATION:

KEY: modals:amendment_proposed
EN: Proposed Amended Text
TRANSLATION:

KEY: modals:amendment_placeholder
EN: Edit the text above to reflect your proposed changes...
TRANSLATION:

KEY: modals:amendment_changes
EN: Changes
TRANSLATION:

KEY: modals:amendment_formal
EN: Formal Amendment
TRANSLATION:

KEY: modals:amendment_cancel
EN: Cancel
TRANSLATION:

KEY: modals:amendment_submit
EN: Propose Amendment
TRANSLATION:

KEY: modals:point_of_order_heading
EN: Point of Order
TRANSLATION:

KEY: modals:point_of_order_desc
EN: A Point of Order calls attention to a breach of rules or procedural error. The chair will rule on your concern.
TRANSLATION:

KEY: modals:point_of_order_label
EN: State Your Concern
TRANSLATION:

KEY: modals:point_of_order_placeholder
EN: Point of order: ...
TRANSLATION:

KEY: modals:point_of_order_cancel
EN: Cancel
TRANSLATION:

KEY: modals:point_of_order_submit
EN: Raise Point of Order
TRANSLATION:

KEY: modals:minutes_correction_heading
EN: Propose Correction to Minutes
TRANSLATION:

KEY: modals:minutes_correction_desc
EN: Describe the correction needed to the minutes from the previous meeting.
TRANSLATION:

KEY: modals:minutes_correction_label
EN: Proposed Correction
TRANSLATION:

KEY: modals:minutes_correction_placeholder
EN: On page X, line Y should read...
TRANSLATION:

KEY: modals:minutes_correction_cancel
EN: Cancel
TRANSLATION:

KEY: modals:minutes_correction_submit
EN: Propose Correction
TRANSLATION:

KEY: modals:incidental_main_heading
EN: Incidental Main Motions
TRANSLATION:

KEY: modals:incidental_main_desc
EN: Choose an incidental main motion template. You can edit the text before introducing it.
TRANSLATION:

KEY: modals:incidental_main_close
EN: Close
TRANSLATION:

KEY: modals:incidental_motions_heading
EN: Incidental Motions
TRANSLATION:

KEY: modals:incidental_motions_desc
EN: Choose an incidental motion to bring before the chair.
TRANSLATION:

KEY: modals:incidental_motions_interrupts
EN: Interrupts
TRANSLATION:

KEY: modals:incidental_motions_no_interrupt
EN: Does not interrupt
TRANSLATION:

KEY: modals:incidental_motions_close
EN: Close
TRANSLATION:

KEY: modals:subsidiary_heading_amend
EN: Propose an Amendment
TRANSLATION:

KEY: modals:subsidiary_heading_postpone_indef
EN: Postpone Indefinitely
TRANSLATION:

KEY: modals:subsidiary_heading_commit
EN: Refer to Committee
TRANSLATION:

KEY: modals:subsidiary_heading_postpone_def
EN: Postpone to a Definite Time
TRANSLATION:

KEY: modals:subsidiary_heading_limit_debate
EN: Limit or Extend Debate
TRANSLATION:

KEY: modals:subsidiary_heading_previous_question
EN: Previous Question (Close Debate)
TRANSLATION:

KEY: modals:subsidiary_heading_lay_on_table
EN: Lay on the Table
TRANSLATION:

KEY: modals:subsidiary_desc
EN: Subsidiary motion — applies to the pending question.
TRANSLATION:

KEY: modals:subsidiary_pending_question
EN: Pending Question:
TRANSLATION:

KEY: modals:subsidiary_amendment_text
EN: Amendment Text
TRANSLATION:

KEY: modals:subsidiary_amendment_placeholder
EN: I move to amend by...
TRANSLATION:

KEY: modals:subsidiary_reason_label
EN: Reason (optional)
TRANSLATION:

KEY: modals:subsidiary_postpone_indef_text
EN: I move to postpone the question indefinitely
TRANSLATION:

KEY: modals:subsidiary_postpone_indef_motion
EN: to postpone the question indefinitely
TRANSLATION:

KEY: modals:subsidiary_commit_motion
EN: to refer the pending question to a committee
TRANSLATION:

KEY: modals:subsidiary_committee_name
EN: Committee Name
TRANSLATION:

KEY: modals:subsidiary_committee_placeholder
EN: e.g., Finance Committee
TRANSLATION:

KEY: modals:subsidiary_instructions_label
EN: Instructions (optional)
TRANSLATION:

KEY: modals:subsidiary_instructions_placeholder
EN: with instructions to...
TRANSLATION:

KEY: modals:subsidiary_postpone_def_motion
EN: to postpone the pending question to a definite time
TRANSLATION:

KEY: modals:subsidiary_postpone_until
EN: Postpone Until
TRANSLATION:

KEY: modals:subsidiary_postpone_placeholder
EN: e.g., next meeting, 3:00 PM
TRANSLATION:

KEY: modals:subsidiary_limit_debate_motion
EN: to limit or extend the limits of debate
TRANSLATION:

KEY: modals:subsidiary_time_limit
EN: Time Limit per Speaker (minutes)
TRANSLATION:

KEY: modals:subsidiary_time_placeholder
EN: e.g., 3
TRANSLATION:

KEY: modals:subsidiary_max_speeches
EN: Max Speeches per Member
TRANSLATION:

KEY: modals:subsidiary_max_placeholder
EN: e.g., 1
TRANSLATION:

KEY: modals:subsidiary_previous_question_motion
EN: to close debate and immediately vote on the pending question
TRANSLATION:

KEY: modals:subsidiary_lay_on_table_motion
EN: to lay the pending question on the table
TRANSLATION:

KEY: modals:subsidiary_cancel
EN: Cancel
TRANSLATION:

KEY: modals:subsidiary_submit
EN: Make Motion
TRANSLATION:

KEY: modals:privileged_heading_adjourn
EN: Move to Adjourn
TRANSLATION:

KEY: modals:privileged_heading_recess
EN: Move to Recess
TRANSLATION:

KEY: modals:privileged_heading_fix_time
EN: Fix Time to Adjourn
TRANSLATION:

KEY: modals:privileged_heading_privilege
EN: Question of Privilege
TRANSLATION:

KEY: modals:privileged_heading_orders
EN: Call for Orders of the Day
TRANSLATION:

KEY: modals:privileged_heading_default
EN: Privileged Motion
TRANSLATION:

KEY: modals:privileged_desc
EN: Privileged motion — takes precedence over all pending business.
TRANSLATION:

KEY: modals:privileged_recess_duration
EN: Recess Duration (minutes)
TRANSLATION:

KEY: modals:privileged_recess_placeholder
EN: 10
TRANSLATION:

KEY: modals:privileged_fix_time_label
EN: Date/Time for Next Meeting
TRANSLATION:

KEY: modals:privileged_fix_time_placeholder
EN: e.g., Thursday at 7:00 PM
TRANSLATION:

KEY: modals:privileged_privilege_label
EN: State the Matter of Privilege
TRANSLATION:

KEY: modals:privileged_privilege_placeholder
EN: I rise to a question of privilege affecting...
TRANSLATION:

KEY: modals:privileged_adjourn_note
EN: This motion, if adopted, will immediately adjourn the meeting.
TRANSLATION:

KEY: modals:privileged_orders_note
EN: This demand requires the assembly to conform to the agenda.
TRANSLATION:

KEY: modals:privileged_cancel
EN: Cancel
TRANSLATION:

KEY: modals:privileged_demand
EN: Demand
TRANSLATION:

KEY: modals:privileged_submit
EN: Make Motion
TRANSLATION:

KEY: modals:bring_back_heading_take
EN: Take from the Table
TRANSLATION:

KEY: modals:bring_back_heading_reconsider
EN: Reconsider
TRANSLATION:

KEY: modals:bring_back_heading_rescind
EN: Rescind/Amend Previously Adopted
TRANSLATION:

KEY: modals:bring_back_heading_default
EN: Bring Back Motion
TRANSLATION:

KEY: modals:bring_back_desc
EN: Bring-back motion — returns a previously decided or tabled question.
TRANSLATION:

KEY: modals:bring_back_no_items
EN: No items available for this action.
TRANSLATION:

KEY: modals:bring_back_select
EN: Select a motion:
TRANSLATION:

KEY: modals:bring_back_tabled
EN: Tabled motion
TRANSLATION:

KEY: modals:bring_back_tabled_at
EN: Tabled at
TRANSLATION:

KEY: modals:bring_back_decided
EN: Decided motion
TRANSLATION:

KEY: modals:bring_back_adopted
EN: Adopted
TRANSLATION:

KEY: modals:bring_back_defeated
EN: Defeated
TRANSLATION:

KEY: modals:bring_back_adopted_motion
EN: Adopted motion
TRANSLATION:

KEY: modals:bring_back_cancel
EN: Cancel
TRANSLATION:

KEY: modals:bring_back_close
EN: Close
TRANSLATION:

KEY: modals:bring_back_submit
EN: Make Motion
TRANSLATION:

KEY: modals:appeal_heading
EN: Appeal the Decision of the Chair
TRANSLATION:

KEY: modals:appeal_desc
EN: An appeal reverses the chair's ruling by a vote of the assembly. Each member may speak once; the chair may speak twice. A tie vote sustains the chair.
TRANSLATION:

KEY: modals:appeal_ruling
EN: Chair's Ruling:
TRANSLATION:

KEY: modals:appeal_cancel
EN: Cancel
TRANSLATION:

KEY: modals:appeal_submit
EN: Appeal
TRANSLATION:

KEY: modals:parl_inquiry_heading
EN: Parliamentary Inquiry
TRANSLATION:

KEY: modals:parl_inquiry_desc
EN: A Parliamentary Inquiry asks the chair a question about procedure or the effect of a motion. The chair will respond to your inquiry.
TRANSLATION:

KEY: modals:parl_inquiry_label
EN: State Your Inquiry
TRANSLATION:

KEY: modals:parl_inquiry_placeholder
EN: I rise to a parliamentary inquiry: Is it in order to...
TRANSLATION:

KEY: modals:parl_inquiry_cancel
EN: Cancel
TRANSLATION:

KEY: modals:parl_inquiry_submit
EN: Submit Inquiry
TRANSLATION:

KEY: modals:request_info_heading
EN: Request for Information
TRANSLATION:

KEY: modals:request_info_desc
EN: A Request for Information (Point of Information) asks a factual question about the business at hand. The chair or a designated member will respond.
TRANSLATION:

KEY: modals:request_info_label
EN: State Your Question
TRANSLATION:

KEY: modals:request_info_placeholder
EN: I rise for a point of information: ...
TRANSLATION:

KEY: modals:request_info_cancel
EN: Cancel
TRANSLATION:

KEY: modals:request_info_submit
EN: Submit Question
TRANSLATION:

KEY: modals:suspend_rules_heading
EN: Suspend the Rules
TRANSLATION:

KEY: modals:suspend_rules_desc
EN: Suspend the Rules allows the assembly to do something that would otherwise be out of order under the standing rules.
TRANSLATION:

KEY: modals:suspend_rules_requirements
EN: Requires a second. Not debatable. Two-thirds vote required.
TRANSLATION:

KEY: modals:suspend_rules_common
EN: Common Purposes
TRANSLATION:

KEY: modals:suspend_rules_purpose_nonmember
EN: Allow a non-member to address the assembly
TRANSLATION:

KEY: modals:suspend_rules_purpose_order
EN: Take up business out of scheduled order
TRANSLATION:

KEY: modals:suspend_rules_purpose_time
EN: Extend time for current speaker
TRANSLATION:

KEY: modals:suspend_rules_purpose_committee
EN: Consider a matter without referral to committee
TRANSLATION:

KEY: modals:suspend_rules_custom
EN: Custom Purpose
TRANSLATION:

KEY: modals:suspend_rules_placeholder
EN: I move to suspend the rules in order to...
TRANSLATION:

KEY: modals:suspend_rules_cancel
EN: Cancel
TRANSLATION:

KEY: modals:suspend_rules_submit
EN: Move to Suspend
TRANSLATION:

KEY: modals:withdraw_heading
EN: Withdraw a Motion
TRANSLATION:

KEY: modals:withdraw_desc_mover
EN: You are the mover of this motion. If there is no objection, the motion will be withdrawn by unanimous consent. If objected to, a majority vote is required.
TRANSLATION:

KEY: modals:withdraw_desc_other
EN: Only the mover may request to withdraw. This will ask the chair to request unanimous consent to withdraw the motion.
TRANSLATION:

KEY: modals:withdraw_motion_label
EN: Motion:
TRANSLATION:

KEY: modals:withdraw_mover_label
EN: Moved by:
TRANSLATION:

KEY: modals:withdraw_cancel
EN: Cancel
TRANSLATION:

KEY: modals:withdraw_submit
EN: Request Withdrawal
TRANSLATION:

KEY: modals:pre_withdraw_heading
EN: Withdraw or Reformulate
TRANSLATION:

KEY: modals:pre_withdraw_desc
EN: The chair has not recognized your motion yet. You may unilaterally withdraw or reformulate it.
TRANSLATION:

KEY: modals:pre_withdraw_motion_label
EN: Your motion:
TRANSLATION:

KEY: modals:pre_withdraw_new_text_label
EN: New text (for reformulation)
TRANSLATION:

KEY: modals:pre_withdraw_placeholder
EN: Enter revised motion text...
TRANSLATION:

KEY: modals:pre_withdraw_withdraw
EN: Withdraw
TRANSLATION:

KEY: modals:pre_withdraw_reformulate
EN: Reformulate
TRANSLATION:

KEY: modals:pre_withdraw_back
EN: Go Back
TRANSLATION:

## settings (115 keys)

KEY: settings:header_title
EN: Hatsell
TRANSLATION:

KEY: settings:header_subtitle
EN: General Settings
TRANSLATION:

KEY: settings:quick_start
EN: Quick Start
TRANSLATION:

KEY: settings:quick_start_desc
EN: Start a meeting immediately with default settings. Or customize below.
TRANSLATION:

KEY: settings:codes_generated_title
EN: Meeting Codes Generated
TRANSLATION:

KEY: settings:codes_share
EN: Share these role-specific codes with participants:
TRANSLATION:

KEY: settings:code_label_chair
EN: Chair
TRANSLATION:

KEY: settings:code_label_vice_chair
EN: Vice Chair
TRANSLATION:

KEY: settings:code_label_secretary
EN: Secretary
TRANSLATION:

KEY: settings:code_label_member
EN: Member
TRANSLATION:

KEY: settings:copy_all_codes
EN: Copy All Codes
TRANSLATION:

KEY: settings:start_meeting
EN: Start Meeting
TRANSLATION:

KEY: settings:section_org_profile
EN: Organization Profile
TRANSLATION:

KEY: settings:label_org_name
EN: Organization Name
TRANSLATION:

KEY: settings:placeholder_org_name
EN: e.g. Springfield Civic Association
TRANSLATION:

KEY: settings:hint_org_name
EN: Appears in the top bar during the meeting and in exported minutes.
TRANSLATION:

KEY: settings:label_total_membership
EN: Total Membership (optional)
TRANSLATION:

KEY: settings:placeholder_total_membership
EN: Total number of members
TRANSLATION:

KEY: settings:hint_total_membership
EN: Used to calculate quorum. Leave blank if unknown.
TRANSLATION:

KEY: settings:label_quorum
EN: Quorum
TRANSLATION:

KEY: settings:quorum_default
EN: Default (majority of membership)
TRANSLATION:

KEY: settings:quorum_fixed
EN: Fixed Number
TRANSLATION:

KEY: settings:quorum_fraction
EN: Fraction of Membership
TRANSLATION:

KEY: settings:placeholder_quorum_number
EN: Number
TRANSLATION:

KEY: settings:placeholder_quorum_fraction
EN: e.g. 0.5
TRANSLATION:

KEY: settings:hint_quorum
EN: Default quorum is a majority of the total membership (RONR).
TRANSLATION:

KEY: settings:label_voting_basis
EN: Voting Basis
TRANSLATION:

KEY: settings:voting_majority
EN: Majority
TRANSLATION:

KEY: settings:voting_two_thirds
EN: Two-Thirds
TRANSLATION:

KEY: settings:votes_cast
EN: Votes cast
TRANSLATION:

KEY: settings:members_present
EN: Members present
TRANSLATION:

KEY: settings:entire_membership
EN: Entire membership
TRANSLATION:

KEY: settings:ronr_default
EN: RONR default
TRANSLATION:

KEY: settings:hint_voting_basis
EN: How votes are counted for each threshold type. RONR default counts only votes actually cast.
TRANSLATION:

KEY: settings:label_debate_limits
EN: Debate Limits
TRANSLATION:

KEY: settings:label_time_per_speech
EN: Time per speech (min)
TRANSLATION:

KEY: settings:label_speeches_per_member
EN: Speeches per member
TRANSLATION:

KEY: settings:label_total_debate
EN: Total debate (min, opt.)
TRANSLATION:

KEY: settings:placeholder_no_limit
EN: No limit
TRANSLATION:

KEY: settings:hint_debate_limits
EN: Leave total debate blank for no limit.
TRANSLATION:

KEY: settings:label_electronic_participation
EN: Electronic Participation
TRANSLATION:

KEY: settings:label_meeting_format
EN: Meeting Format
TRANSLATION:

KEY: settings:format_in_person
EN: In Person
TRANSLATION:

KEY: settings:format_electronic
EN: Fully Electronic
TRANSLATION:

KEY: settings:format_hybrid
EN: Hybrid
TRANSLATION:

KEY: settings:label_electronic_voting
EN: Electronic Voting
TRANSLATION:

KEY: settings:label_proxy_voting
EN: Proxy Voting
TRANSLATION:

KEY: settings:hint_electronic_participation
EN: Electronic and proxy voting must be authorized in your bylaws.
TRANSLATION:

KEY: settings:section_meeting_settings
EN: Settings for this meeting
TRANSLATION:

KEY: settings:label_meeting_name
EN: Meeting Name
TRANSLATION:

KEY: settings:placeholder_meeting_name
EN: e.g. Regular Meeting, Annual Meeting
TRANSLATION:

KEY: settings:hint_meeting_name
EN: Displayed in the top bar and used in minutes export.
TRANSLATION:

KEY: settings:label_language
EN: Meeting Language
TRANSLATION:

KEY: settings:language_en
EN: English
TRANSLATION:

KEY: settings:language_pt_br
EN: Português (Brasil)
TRANSLATION:

KEY: settings:hint_language
EN: All participants will see the meeting interface in this language.
TRANSLATION:

KEY: settings:label_agenda
EN: Agenda
TRANSLATION:

KEY: settings:agenda_guidance
EN: Guidance only (chair reference)
TRANSLATION:

KEY: settings:agenda_orders
EN: Orders of the Day (adopted agenda)
TRANSLATION:

KEY: settings:hint_agenda_guidance
EN: Items listed here will guide the chair but are not binding.
TRANSLATION:

KEY: settings:hint_agenda_orders
EN: Items will be treated as adopted orders; deviating requires suspending the rules.
TRANSLATION:

KEY: settings:add_agenda_item
EN: + Add Agenda Item
TRANSLATION:

KEY: settings:agenda_title_label
EN: Title *
TRANSLATION:

KEY: settings:agenda_category_label
EN: Category *
TRANSLATION:

KEY: settings:agenda_category_placeholder
EN: Select category...
TRANSLATION:

KEY: settings:agenda_owner_label
EN: Owner
TRANSLATION:

KEY: settings:agenda_owner_placeholder
EN: Who presents
TRANSLATION:

KEY: settings:agenda_time_label
EN: Time target (min)
TRANSLATION:

KEY: settings:agenda_time_placeholder
EN: Optional
TRANSLATION:

KEY: settings:agenda_notes_label
EN: Notes
TRANSLATION:

KEY: settings:agenda_notes_placeholder
EN: Optional
TRANSLATION:

KEY: settings:agenda_save
EN: Save
TRANSLATION:

KEY: settings:agenda_add
EN: Add Item
TRANSLATION:

KEY: settings:agenda_edit
EN: Edit
TRANSLATION:

KEY: settings:agenda_placeholder_title
EN: Agenda item title
TRANSLATION:

KEY: settings:label_previous_notice
EN: Previous Notice
TRANSLATION:

KEY: settings:previous_notice_desc
EN: Check items for which previous notice has been given:
TRANSLATION:

KEY: settings:notice_rescind
EN: Rescind / Amend Something Previously Adopted
TRANSLATION:

KEY: settings:notice_bylaws
EN: Bylaw Amendments
TRANSLATION:

KEY: settings:notice_discharge
EN: Discharge a Committee
TRANSLATION:

KEY: settings:notice_disciplinary
EN: Formal Disciplinary Procedure
TRANSLATION:

KEY: settings:hint_previous_notice
EN: Checking these indicates notice was given, lowering the required vote to a majority.
TRANSLATION:

KEY: settings:label_meeting_type
EN: Meeting Type
TRANSLATION:

KEY: settings:meeting_type_regular
EN: Regular Meeting
TRANSLATION:

KEY: settings:meeting_type_special
EN: Special Meeting
TRANSLATION:

KEY: settings:special_restrict
EN: Restrict business to items specified in the call
TRANSLATION:

KEY: settings:hint_meeting_type
EN: Special meetings may only consider business mentioned in the call (RONR).
TRANSLATION:

KEY: settings:label_electronic_procedures
EN: Electronic Meeting Procedures
TRANSLATION:

KEY: settings:label_recognition_method
EN: Recognition Method
TRANSLATION:

KEY: settings:recognition_queue
EN: Queue Only
TRANSLATION:

KEY: settings:recognition_chair
EN: Chair Recognizes
TRANSLATION:

KEY: settings:recognition_hybrid
EN: Hybrid
TRANSLATION:

KEY: settings:label_chat_policy
EN: Chat Policy
TRANSLATION:

KEY: settings:chat_informational
EN: Informational Only
TRANSLATION:

KEY: settings:chat_motions
EN: Motions Allowed
TRANSLATION:

KEY: settings:label_raise_hand
EN: Raise Hand Mechanism
TRANSLATION:

KEY: settings:raise_hand_button
EN: Button
TRANSLATION:

KEY: settings:raise_hand_chat
EN: Chat Keyword
TRANSLATION:

KEY: settings:hint_electronic_procedures
EN: Configure how electronic participation is managed during this meeting.
TRANSLATION:

KEY: settings:label_opening_package
EN: Opening Package
TRANSLATION:

KEY: settings:opening_package_enable
EN: Propose bundled adoption of opening items
TRANSLATION:

KEY: settings:opening_adopt_agenda
EN: Adopt the agenda
TRANSLATION:

KEY: settings:opening_adopt_electronic
EN: Adopt electronic meeting rules
TRANSLATION:

KEY: settings:hint_opening_package
EN: If enabled, the chair will be prompted to propose adopting these items together at the start of the meeting.
TRANSLATION:

KEY: settings:label_timer_enforcement
EN: Timer Enforcement
TRANSLATION:

KEY: settings:timer_auto_yield
EN: Automatically yield the floor when speaking time expires
TRANSLATION:

KEY: settings:hint_timer_enforcement
EN: If enabled, the speaker's floor is automatically yielded when the time limit is reached. Otherwise, the timer continues running past zero and the chair may allow the speaker to finish.
TRANSLATION:

KEY: settings:label_audio_notifications
EN: Audio Notifications
TRANSLATION:

KEY: settings:audio_enable
EN: Enable audio cues for key meeting events
TRANSLATION:

KEY: settings:hint_audio_notifications
EN: Plays brief tones when voting opens, speaking time expires, motions are seconded, and other important events occur.
TRANSLATION:

KEY: settings:label_vote_transparency
EN: Vote Transparency
TRANSLATION:

KEY: settings:vote_show_details
EN: Display individual votes when results are announced
TRANSLATION:

KEY: settings:hint_vote_transparency
EN: When enabled, the chair will see how each member voted (by name) in the result announcement. By default, only aggregate totals are shown.
TRANSLATION:

KEY: settings:button_confirm
EN: Confirm
TRANSLATION:

KEY: settings:button_cancel
EN: Cancel
TRANSLATION:

## tutorials (223 keys)

KEY: tutorials:nav_brand
EN: Hatsell
TRANSLATION:

KEY: tutorials:nav_overview
EN: Overview
TRANSLATION:

KEY: tutorials:nav_chair
EN: For the Chair
TRANSLATION:

KEY: tutorials:nav_members
EN: For Members
TRANSLATION:

KEY: tutorials:nav_back_aria
EN: Back to Hatsell
TRANSLATION:

KEY: tutorials:nav_sections_aria
EN: Tutorial sections
TRANSLATION:

KEY: tutorials:open_hatsell
EN: Open Hatsell
TRANSLATION:

KEY: tutorials:member_guide
EN: Member Guide
TRANSLATION:

KEY: tutorials:chair_guide
EN: Chair Guide
TRANSLATION:

KEY: tutorials:overview_hero_title
EN: Fair Meetings for Everyone
TRANSLATION:

KEY: tutorials:overview_hero_desc
EN: Parliamentary procedure exists to give every member an equal voice. Hatsell makes it effortless.
TRANSLATION:

KEY: tutorials:overview_familiar_title
EN: Does this sound familiar?
TRANSLATION:

KEY: tutorials:overview_familiar_h1
EN: "We already use Robert's Rules, but..."
TRANSLATION:

KEY: tutorials:overview_familiar_p1
EN: Your organization adopted parliamentary procedure years ago. In theory, everyone has an equal voice. In practice, it doesn't feel that way.
TRANSLATION:

KEY: tutorials:overview_familiar_p2
EN: The chair fumbles through half-remembered scripts. A few confident members dominate the floor while others sit in silence, unsure when they're allowed to speak or how to formally disagree. Someone makes a motion, but nobody's quite sure if it needs a second, whether it can be amended right now, or what vote threshold applies. The secretary scribbles notes and hopes for the best.
TRANSLATION:

KEY: tutorials:overview_familiar_callout1
EN: You leave the meeting suspecting that decisions were made more by confusion than by consensus.
TRANSLATION:

KEY: tutorials:overview_familiar_h2
EN: "We don't really have rules at all..."
TRANSLATION:

KEY: tutorials:overview_familiar_p3
EN: Your group meets regularly — a board, a club, a committee, a community council. There's an agenda, loosely followed. Whoever talks loudest or longest tends to win. Side conversations derail the discussion. When a decision is finally reached, half the room isn't sure what was actually decided.
TRANSLATION:

KEY: tutorials:overview_familiar_callout2
EN: You leave the meeting frustrated that an hour was spent and nothing clear was accomplished.
TRANSLATION:

KEY: tutorials:overview_whatif_title
EN: What if the rules just... ran themselves?
TRANSLATION:

KEY: tutorials:overview_whatif_p1
EN: Parliamentary procedure exists to solve exactly these problems. It guarantees every member an equal right to speak, to propose ideas, to disagree, and to vote. It ensures that decisions are clear, recorded, and final.
TRANSLATION:

KEY: tutorials:overview_whatif_p2
EN: The problem was never the rules. It was that the rules lived in a 700-page book, and nobody had time to memorize them.
TRANSLATION:

KEY: tutorials:overview_whatif_callout
EN: <strong>Hatsell puts the rules in everyone's hands — automatically.</strong>
TRANSLATION:

KEY: tutorials:overview_how_title
EN: How Hatsell works
TRANSLATION:

KEY: tutorials:overview_how_intro
EN: Hatsell is a real-time web app that guides your meeting through proper parliamentary procedure, step by step. The chair doesn't need to memorize scripts. Members don't need to know the rules. The app tells everyone what they can do, when they can do it, and what happens next.
TRANSLATION:

KEY: tutorials:overview_how_code_title
EN: One meeting, one code
TRANSLATION:

KEY: tutorials:overview_how_code_desc
EN: The chair creates a meeting and gets a set of role codes — one for the chair, one for the vice chair, one for the secretary, and one for members. Share the member code and everyone joins from their own phone or laptop. No accounts, no sign-ups, no downloads.
TRANSLATION:

KEY: tutorials:overview_how_guide_title
EN: The app guides the chair
TRANSLATION:

KEY: tutorials:overview_how_guide_desc
EN: At every stage of the meeting, Hatsell shows the chair exactly what to say and do. Call the meeting to order. Conduct roll call. Ask for approval of minutes. Move through the agenda. The chair follows the prompts — the procedure takes care of itself.
TRANSLATION:

KEY: tutorials:overview_how_options_title
EN: Every member sees their options
TRANSLATION:

KEY: tutorials:overview_how_options_desc
EN: When it's time to act, members see clear buttons: make a motion, second a motion, request to speak in favor or against, vote aye or nay. If an action isn't available right now — because someone else has the floor, or because the motion needs a second first — the button simply isn't there. No guessing, no interrupting, no awkward silence.
TRANSLATION:

KEY: tutorials:overview_how_debate_title
EN: Fair, structured debate
TRANSLATION:

KEY: tutorials:overview_how_debate_desc
EN: Want to speak? Join the queue. Hatsell tracks who has spoken, how many times, and for how long. The chair recognizes speakers in order. Both sides get heard. When debate is done, the vote is called.
TRANSLATION:

KEY: tutorials:overview_how_decisions_title
EN: Clear decisions, on the record
TRANSLATION:

KEY: tutorials:overview_how_decisions_desc
EN: Votes are counted instantly and displayed to everyone. The result is announced. The meeting log captures every motion, every vote, every outcome. When the meeting ends, there's a clear record of what happened and what was decided.
TRANSLATION:

KEY: tutorials:overview_fivemin_title
EN: A meeting in five minutes
TRANSLATION:

KEY: tutorials:overview_fivemin_intro
EN: Here's what a typical Hatsell meeting looks like:
TRANSLATION:

KEY: tutorials:overview_step1_title
EN: Create and join.
TRANSLATION:

KEY: tutorials:overview_step1_desc
EN: The chair creates a meeting, configures a few settings (organization name, quorum, debate time limits), and shares the member code. Everyone joins.
TRANSLATION:

KEY: tutorials:overview_step2_title
EN: Call to order.
TRANSLATION:

KEY: tutorials:overview_step2_desc
EN: The chair taps one button. The meeting begins.
TRANSLATION:

KEY: tutorials:overview_step3_title
EN: Roll call.
TRANSLATION:

KEY: tutorials:overview_step3_desc
EN: The secretary calls names. Members tap "Present" on their screens. Quorum is confirmed automatically.
TRANSLATION:

KEY: tutorials:overview_step4_title
EN: Business.
TRANSLATION:

KEY: tutorials:overview_step4_desc
EN: A member makes a motion: "I move that we allocate $500 for a community bulletin board." Another member seconds it. The chair opens debate. Two people speak — one in favor, one against. The chair calls the vote. Members tap Aye or Nay. The motion passes, 4 to 1.
TRANSLATION:

KEY: tutorials:overview_step5_title
EN: Adjourn.
TRANSLATION:

KEY: tutorials:overview_step5_desc
EN: No further business. The chair adjourns the meeting. The log shows everything that happened.
TRANSLATION:

KEY: tutorials:overview_fivemin_callout
EN: <strong>Total time:</strong> as long as your business takes. No longer.
TRANSLATION:

KEY: tutorials:overview_noneed_title
EN: What you don't need to know
TRANSLATION:

KEY: tutorials:overview_noneed_p1
EN: You don't need to own a copy of Robert's Rules. You don't need to know what "subsidiary motion" means. You don't need to memorize when a motion is debatable or what vote it requires.
TRANSLATION:

KEY: tutorials:overview_noneed_p2
EN: Hatsell knows. It encodes the rules of parliamentary procedure so you can focus on what actually matters: the ideas your group is discussing and the decisions you're making together.
TRANSLATION:

KEY: tutorials:overview_noneed_p3
EN: If you want to go deeper — to understand why the rules work the way they do — Hatsell won't stop you. But you'll never be blocked because you forgot a technicality.
TRANSLATION:

KEY: tutorials:overview_ready_title
EN: Ready to dive in?
TRANSLATION:

KEY: tutorials:overview_ready_desc
EN: Choose the guide that matches your role. Or just open Hatsell and follow the prompts — that's what they're there for.
TRANSLATION:

KEY: tutorials:overview_card_chair_title
EN: For the Chair
TRANSLATION:

KEY: tutorials:overview_card_chair_desc
EN: Creating a meeting, running each stage, managing debate, handling interruptions, and adjourning.
TRANSLATION:

KEY: tutorials:overview_card_member_title
EN: For Members
TRANSLATION:

KEY: tutorials:overview_card_member_desc
EN: Joining, making motions, speaking in debate, voting, and using the tools available to you.
TRANSLATION:

KEY: tutorials:chair_hero_title
EN: Hatsell for the Chair
TRANSLATION:

KEY: tutorials:chair_hero_desc
EN: You're running the meeting. That might sound intimidating — but Hatsell does the heavy lifting. You just follow the prompts.
TRANSLATION:

KEY: tutorials:chair_before_title
EN: Part 1: Before the meeting
TRANSLATION:

KEY: tutorials:chair_create_title
EN: Create the meeting
TRANSLATION:

KEY: tutorials:chair_create_step1
EN: Open Hatsell and enter your name.
TRANSLATION:

KEY: tutorials:chair_create_step2
EN: Tap <strong>Create a New Meeting</strong>.
TRANSLATION:

KEY: tutorials:chair_create_step3
EN: You'll land on the General Settings screen. Fill in what you know — everything has sensible defaults.
TRANSLATION:

KEY: tutorials:chair_org_title
EN: Organization Profile
TRANSLATION:

KEY: tutorials:chair_org_name_label
EN: Organization name
TRANSLATION:

KEY: tutorials:chair_org_name_desc
EN: Shows in the top bar during the meeting (e.g., "Maplewood Neighborhood Association").
TRANSLATION:

KEY: tutorials:chair_org_membership_label
EN: Total membership
TRANSLATION:

KEY: tutorials:chair_org_membership_desc
EN: Used to calculate quorum. Leave blank if you're not sure.
TRANSLATION:

KEY: tutorials:chair_org_quorum_label
EN: Quorum
TRANSLATION:

KEY: tutorials:chair_org_quorum_desc
EN: The minimum number of members needed to do business. The default (majority of membership) follows Robert's Rules. You can set a fixed number or fraction if your bylaws say something different.
TRANSLATION:

KEY: tutorials:chair_org_voting_label
EN: Voting basis
TRANSLATION:

KEY: tutorials:chair_org_voting_desc
EN: How votes are counted. The default ("votes cast") is correct for most organizations. Only change this if your bylaws specify otherwise.
TRANSLATION:

KEY: tutorials:chair_org_debate_label
EN: Debate limits
TRANSLATION:

KEY: tutorials:chair_org_debate_desc
EN: How long each person can speak (default: 10 minutes) and how many times (default: 2). You can also set a total debate time limit per motion.
TRANSLATION:

KEY: tutorials:chair_settings_title
EN: Settings for this meeting
TRANSLATION:

KEY: tutorials:chair_settings_name_label
EN: Meeting name
TRANSLATION:

KEY: tutorials:chair_settings_name_desc
EN: "Regular Meeting," "Annual Meeting," etc.
TRANSLATION:

KEY: tutorials:chair_settings_agenda_label
EN: Agenda
TRANSLATION:

KEY: tutorials:chair_settings_agenda_desc
EN: Optionally add agenda items. You can use them as guidance (a reference for yourself) or as adopted Orders of the Day (binding).
TRANSLATION:

KEY: tutorials:chair_settings_notice_label
EN: Previous notice
TRANSLATION:

KEY: tutorials:chair_settings_notice_desc
EN: Check any items that members were notified about in advance. This affects what vote thresholds apply.
TRANSLATION:

KEY: tutorials:chair_settings_type_label
EN: Meeting type
TRANSLATION:

KEY: tutorials:chair_settings_type_desc
EN: Regular or special. Special meetings can only discuss business specified in the call.
TRANSLATION:

KEY: tutorials:chair_settings_callout
EN: Don't overthink the settings. The defaults work for a standard meeting. You can always come back and adjust for next time.
TRANSLATION:

KEY: tutorials:chair_codes_title
EN: Share the codes
TRANSLATION:

KEY: tutorials:chair_codes_step1
EN: Tap <strong>Confirm</strong>. Hatsell generates a unique code for each role: Chair, Vice Chair, Secretary, and Member.
TRANSLATION:

KEY: tutorials:chair_codes_step2
EN: Share the appropriate code with each person. The <strong>Member</strong> code is the one most people need. You can tap <strong>Copy All Codes</strong> to paste them into a group chat or email.
TRANSLATION:

KEY: tutorials:chair_codes_step3
EN: Tap <strong>Start Meeting</strong> when you're ready.
TRANSLATION:

KEY: tutorials:chair_running_title
EN: Part 2: Running the meeting
TRANSLATION:

KEY: tutorials:chair_running_intro
EN: Once the meeting starts, you'll see three things that will be your constant companions:
TRANSLATION:

KEY: tutorials:chair_companion_guidance_title
EN: The guidance box
TRANSLATION:

KEY: tutorials:chair_companion_guidance_desc
EN: Tells you what to say and what to do next. This is your script.
TRANSLATION:

KEY: tutorials:chair_companion_actions_title
EN: The chair actions
TRANSLATION:

KEY: tutorials:chair_companion_actions_desc
EN: Prominent buttons for whatever decision the meeting needs from you right now.
TRANSLATION:

KEY: tutorials:chair_companion_topbar_title
EN: The top bar
TRANSLATION:

KEY: tutorials:chair_companion_topbar_desc
EN: Shows the meeting stage, organization name, and drawer toggles for participants, speaking queue, and meeting log.
TRANSLATION:

KEY: tutorials:chair_order_title
EN: Call to order
TRANSLATION:

KEY: tutorials:chair_order_desc
EN: The guidance box shows your opening script. Tap <strong>Call to Order</strong>. That's it — the meeting has begun.
TRANSLATION:

KEY: tutorials:chair_roll_title
EN: Roll call
TRANSLATION:

KEY: tutorials:chair_roll_desc
EN: The secretary (or you, if there's no secretary) calls each member's name by tapping their card. Members tap <strong>Present</strong> on their own screens. Once everyone has responded, you'll see a button to <strong>Complete Roll Call</strong>.
TRANSLATION:

KEY: tutorials:chair_roll_callout
EN: If you set a quorum, Hatsell tells you whether quorum is met. If it's not, you can't proceed to business — the app will guide you.
TRANSLATION:

KEY: tutorials:chair_minutes_title
EN: Approve minutes
TRANSLATION:

KEY: tutorials:chair_minutes_desc
EN: If this isn't your first meeting, the guidance prompts you to ask for approval of the previous meeting's minutes. Members can submit corrections. You can accept corrections by general consent or put them to a vote.
TRANSLATION:

KEY: tutorials:chair_business_title
EN: New business
TRANSLATION:

KEY: tutorials:chair_business_intro
EN: This is where the real work happens.
TRANSLATION:

KEY: tutorials:chair_business_step1
EN: <strong>A member makes a motion.</strong> They tap their "Make a Motion" button and type what they propose. You'll see it appear as a pending motion.
TRANSLATION:

KEY: tutorials:chair_business_step2
EN: <strong>You recognize it.</strong> Tap the motion to bring it to the floor. (If it's clearly out of order, you can reject it with an explanation.)
TRANSLATION:

KEY: tutorials:chair_business_step3
EN: <strong>Another member seconds.</strong> The motion needs a second before debate can begin. If nobody seconds, you declare "no second" and the motion dies.
TRANSLATION:

KEY: tutorials:chair_business_step4
EN: <strong>You state the question.</strong> The guidance gives you the script: "It is moved and seconded that [motion text]. Is there any debate?"
TRANSLATION:

KEY: tutorials:chair_business_step5
EN: <strong>Members debate.</strong> They join the speaking queue by tapping "Speak in Favor" or "Speak Against." You recognize them in order. The speaking timer tracks their time.
TRANSLATION:

KEY: tutorials:chair_business_step6
EN: <strong>You call the vote.</strong> When debate is done (or a member moves to close debate), tap <strong>Call the Vote</strong>. Members vote Aye, Nay, or Abstain on their screens.
TRANSLATION:

KEY: tutorials:chair_business_step7
EN: <strong>You announce the result.</strong> Hatsell counts the votes and tells you whether the motion passed or failed. Tap <strong>Announce Result</strong> and the guidance gives you the script.
TRANSLATION:

KEY: tutorials:chair_interruptions_title
EN: Handling interruptions
TRANSLATION:

KEY: tutorials:chair_interruptions_intro
EN: During business, members can raise:
TRANSLATION:

KEY: tutorials:chair_int_poo_label
EN: Point of order
TRANSLATION:

KEY: tutorials:chair_int_poo_desc
EN: A member thinks the rules are being broken. You'll see it immediately and must rule on it.
TRANSLATION:

KEY: tutorials:chair_int_inquiry_label
EN: Parliamentary inquiry
TRANSLATION:

KEY: tutorials:chair_int_inquiry_desc
EN: A member has a question about procedure. Answer it and move on.
TRANSLATION:

KEY: tutorials:chair_int_amend_label
EN: Amendments
TRANSLATION:

KEY: tutorials:chair_int_amend_desc
EN: A member wants to modify the motion on the floor. Amendments are debated and voted on before returning to the main motion.
TRANSLATION:

KEY: tutorials:chair_int_priv_label
EN: Privileged motions
TRANSLATION:

KEY: tutorials:chair_int_priv_desc
EN: A member moves to recess or to adjourn. These take priority over regular business.
TRANSLATION:

KEY: tutorials:chair_interruptions_callout
EN: Don't worry about remembering which of these is allowed when. Hatsell only shows members the options that are currently in order. If a button appears, they can use it.
TRANSLATION:

KEY: tutorials:chair_adjourn_title
EN: Adjourn
TRANSLATION:

KEY: tutorials:chair_adjourn_desc
EN: When there's no further business, tap <strong>Adjourn</strong> (or a member can move to adjourn). The meeting ends. The log contains a complete record of everything that happened.
TRANSLATION:

KEY: tutorials:chair_toolkit_title
EN: Part 3: Your toolkit
TRANSLATION:

KEY: tutorials:chair_drawers_title
EN: The drawers
TRANSLATION:

KEY: tutorials:chair_drawers_intro
EN: Tap the buttons in the top bar to open:
TRANSLATION:

KEY: tutorials:chair_drawer_members_label
EN: Members
TRANSLATION:

KEY: tutorials:chair_drawer_members_desc
EN: Who's connected, their roles, and whether quorum is met. You can also set quorum here if you didn't set it during setup.
TRANSLATION:

KEY: tutorials:chair_drawer_queue_label
EN: Queue
TRANSLATION:

KEY: tutorials:chair_drawer_queue_desc
EN: The speaking queue, showing who's waiting and their stance (for/against).
TRANSLATION:

KEY: tutorials:chair_drawer_log_label
EN: Log
TRANSLATION:

KEY: tutorials:chair_drawer_log_desc
EN: A running record of every action taken in the meeting.
TRANSLATION:

KEY: tutorials:chair_guidance_title
EN: What the guidance box does for you
TRANSLATION:

KEY: tutorials:chair_guidance_desc
EN: The guidance box updates at every stage and transition. It tells you what to say out loud (in italic script text), what button to press next, and what the members are waiting for.
TRANSLATION:

KEY: tutorials:chair_guidance_callout
EN: If you ever feel lost, read the guidance box. It always knows where you are.
TRANSLATION:

KEY: tutorials:chair_unexpected_title
EN: When a member does something unexpected
TRANSLATION:

KEY: tutorials:chair_unexpected_p1
EN: Parliamentary procedure has a response for everything. If a member raises a point of order, the guidance will tell you how to rule. If someone moves to table the motion, the app walks you through it. If an appeal is made against your ruling, Hatsell handles the vote.
TRANSLATION:

KEY: tutorials:chair_unexpected_p2
EN: You don't need to anticipate these situations. Just respond when they come up — the app will guide you through.
TRANSLATION:

KEY: tutorials:chair_ref_title
EN: Quick reference
TRANSLATION:

KEY: tutorials:chair_ref_order_label
EN: Call to Order
TRANSLATION:

KEY: tutorials:chair_ref_order_desc
EN: Tap the button, read the script
TRANSLATION:

KEY: tutorials:chair_ref_roll_label
EN: Roll Call
TRANSLATION:

KEY: tutorials:chair_ref_roll_desc
EN: Wait for members to respond, then complete
TRANSLATION:

KEY: tutorials:chair_ref_minutes_label
EN: Minutes
TRANSLATION:

KEY: tutorials:chair_ref_minutes_desc
EN: Ask for corrections, approve
TRANSLATION:

KEY: tutorials:chair_ref_business_label
EN: Business
TRANSLATION:

KEY: tutorials:chair_ref_business_desc
EN: Recognize motions, manage debate, call votes, announce results
TRANSLATION:

KEY: tutorials:chair_ref_adjourn_label
EN: Adjourn
TRANSLATION:

KEY: tutorials:chair_ref_adjourn_desc
EN: Tap Adjourn or recognize a motion to adjourn
TRANSLATION:

KEY: tutorials:chair_tips_title
EN: Tips
TRANSLATION:

KEY: tutorials:chair_tip1
EN: <strong>You don't need to talk fast.</strong> Parliamentary procedure is designed to be deliberate. Take your time.
TRANSLATION:

KEY: tutorials:chair_tip2
EN: <strong>Read the scripts out loud.</strong> They're there for a reason — they set expectations for the members.
TRANSLATION:

KEY: tutorials:chair_tip3
EN: <strong>Use the speaking timer.</strong> It keeps debate fair without you having to be the bad guy.
TRANSLATION:

KEY: tutorials:chair_tip4
EN: <strong>Don't skip roll call</strong> for formal meetings. Quorum matters — it protects decisions from being challenged later.
TRANSLATION:

KEY: tutorials:chair_tip5
EN: <strong>Check the log</strong> if you lose track. It records everything.
TRANSLATION:

KEY: tutorials:chair_tip6
EN: <strong>Your first meeting will feel slow.</strong> That's normal. By the third meeting, the flow will feel natural.
TRANSLATION:

KEY: tutorials:member_hero_title
EN: Hatsell for Members
TRANSLATION:

KEY: tutorials:member_hero_desc
EN: You don't need to know parliamentary procedure — the app shows you exactly what you can do at every moment.
TRANSLATION:

KEY: tutorials:member_joining_title
EN: Joining the meeting
TRANSLATION:

KEY: tutorials:member_join_step1
EN: Open Hatsell and enter your name.
TRANSLATION:

KEY: tutorials:member_join_step2
EN: Enter the meeting code you were given and tap <strong>Join Meeting</strong>.
TRANSLATION:

KEY: tutorials:member_join_step3
EN: You're in. You'll see the meeting screen with the current stage at the top.
TRANSLATION:

KEY: tutorials:member_join_callout
EN: That's it. No account, no sign-up. The code determines your role — if you were given the Member code, you join as a member. If you were given the Secretary or Vice Chair code, you join with that role automatically.
TRANSLATION:

KEY: tutorials:member_flow_title
EN: The meeting flow
TRANSLATION:

KEY: tutorials:member_flow_intro
EN: The chair runs the meeting through a series of stages. You don't need to memorize them — just watch your screen for what's available to you.
TRANSLATION:

KEY: tutorials:member_roll_title
EN: Roll call
TRANSLATION:

KEY: tutorials:member_roll_desc
EN: The secretary (or chair) will call your name. When you see the prompt, tap <strong>Present</strong>. This confirms your attendance. The meeting can't proceed until enough members are present (that's called quorum).
TRANSLATION:

KEY: tutorials:member_minutes_title
EN: Approving minutes
TRANSLATION:

KEY: tutorials:member_minutes_desc
EN: If there are minutes from a previous meeting, the chair will ask for approval. You have two options:
TRANSLATION:

KEY: tutorials:member_minutes_opt1
EN: If the minutes look correct, do nothing — they'll be approved by general consent.
TRANSLATION:

KEY: tutorials:member_minutes_opt2
EN: If something needs correcting, tap <strong>Submit Correction</strong> and describe what should change.
TRANSLATION:

KEY: tutorials:member_business_title
EN: Business — this is where you matter most
TRANSLATION:

KEY: tutorials:member_business_intro
EN: This is the heart of the meeting: proposals, debate, and decisions.
TRANSLATION:

KEY: tutorials:member_motion_title
EN: Making a motion
TRANSLATION:

KEY: tutorials:member_motion_p1
EN: If you have a proposal — something you want the group to decide on — tap <strong>Make a Motion</strong>. Type what you're proposing in plain language (e.g., "Allocate $500 for a community bulletin board"). Submit it.
TRANSLATION:

KEY: tutorials:member_motion_p2
EN: The chair will recognize your motion and bring it to the floor. Then it needs a <strong>second</strong> from another member before debate can begin.
TRANSLATION:

KEY: tutorials:member_second_title
EN: Seconding a motion
TRANSLATION:

KEY: tutorials:member_second_desc
EN: When someone else makes a motion, you'll see a <strong>Second</strong> button. Tapping it means "I think this is worth discussing" — it doesn't mean you agree. A motion needs at least one second to move forward.
TRANSLATION:

KEY: tutorials:member_speaking_title
EN: Speaking in debate
TRANSLATION:

KEY: tutorials:member_speaking_intro
EN: Once a motion is on the floor and open for debate, you can request to speak. You'll choose a stance:
TRANSLATION:

KEY: tutorials:member_stance_favor_title
EN: Speak in Favor
TRANSLATION:

KEY: tutorials:member_stance_favor_desc
EN: You support the motion
TRANSLATION:

KEY: tutorials:member_stance_against_title
EN: Speak Against
TRANSLATION:

KEY: tutorials:member_stance_against_desc
EN: You oppose it
TRANSLATION:

KEY: tutorials:member_speaking_desc
EN: You're added to the speaking queue. The chair recognizes speakers in order. When it's your turn, a timer starts — speak your piece within the time limit. When you're done, tap <strong>Yield the Floor</strong> (or the timer will run out).
TRANSLATION:

KEY: tutorials:member_voting_title
EN: Voting
TRANSLATION:

KEY: tutorials:member_voting_intro
EN: When debate is over, the chair calls the vote. Three buttons appear:
TRANSLATION:

KEY: tutorials:member_voting_desc
EN: Tap once. Your vote is recorded. When everyone has voted (or the chair closes the vote), the result is announced.
TRANSLATION:

KEY: tutorials:member_other_title
EN: Other things you can do
TRANSLATION:

KEY: tutorials:member_other_intro
EN: During business, you may have more options depending on what's happening. You don't need to memorize any of this:
TRANSLATION:

KEY: tutorials:member_other_callout
EN: If an action is available, you'll see a button for it. If it's not available right now, the button won't be there.
TRANSLATION:

KEY: tutorials:member_amend_label
EN: Amend a motion
TRANSLATION:

KEY: tutorials:member_amend_desc
EN: You want to change the wording of the motion on the floor. Tap Amend, type your proposed change. It gets debated and voted on separately before the group returns to the original motion.
TRANSLATION:

KEY: tutorials:member_poo_label
EN: Point of order
TRANSLATION:

KEY: tutorials:member_poo_desc
EN: You think the rules are being broken (someone is speaking out of turn, the motion isn't in order, etc.). Tap Point of Order and describe your concern. The chair must stop and rule on it immediately.
TRANSLATION:

KEY: tutorials:member_inquiry_label
EN: Parliamentary inquiry
TRANSLATION:

KEY: tutorials:member_inquiry_desc
EN: You have a question about procedure ("Can we amend this motion?" or "How many votes does this need?"). The chair will answer.
TRANSLATION:

KEY: tutorials:member_info_label
EN: Request for information
TRANSLATION:

KEY: tutorials:member_info_desc
EN: You need a factual clarification before you can vote ("What's our current budget balance?").
TRANSLATION:

KEY: tutorials:member_appeal_label
EN: Appeal
TRANSLATION:

KEY: tutorials:member_appeal_desc
EN: You disagree with the chair's ruling on a point of order. An appeal puts the question to the whole group — majority rules.
TRANSLATION:

KEY: tutorials:member_adjourn_label
EN: Move to adjourn
TRANSLATION:

KEY: tutorials:member_adjourn_desc
EN: You think the meeting should end. This gets voted on.
TRANSLATION:

KEY: tutorials:member_screen_title
EN: What you'll see on screen
TRANSLATION:

KEY: tutorials:member_screen_stage_title
EN: The meeting stage
TRANSLATION:

KEY: tutorials:member_screen_stage_desc
EN: The large heading at the top tells you where the meeting is (Roll Call, New Business, Voting, etc.).
TRANSLATION:

KEY: tutorials:member_screen_motion_title
EN: The current motion
TRANSLATION:

KEY: tutorials:member_screen_motion_desc
EN: When a motion is on the floor, you'll see its text, who moved it, who seconded it, and its current status (debating, voting, etc.).
TRANSLATION:

KEY: tutorials:member_screen_actions_title
EN: Your action buttons
TRANSLATION:

KEY: tutorials:member_screen_actions_desc
EN: These change based on what's happening. They're the only things you need to pay attention to. If there's something for you to do, there's a button for it.
TRANSLATION:

KEY: tutorials:member_screen_topbar_title
EN: The top bar
TRANSLATION:

KEY: tutorials:member_screen_topbar_desc
EN: Has buttons to open the participant list, speaking queue, and meeting log. Use these if you want to see who's in the meeting, where you are in the queue, or what's happened so far.
TRANSLATION:

KEY: tutorials:member_tips_title
EN: Tips
TRANSLATION:

KEY: tutorials:member_tip1
EN: <strong>You can't break anything.</strong> The app only lets you do things that are in order. You can't accidentally speak out of turn or make an invalid motion.
TRANSLATION:

KEY: tutorials:member_tip2
EN: <strong>You don't need to raise your hand.</strong> Tap the button. The queue handles it.
TRANSLATION:

KEY: tutorials:member_tip3
EN: <strong>Seconding isn't agreeing.</strong> It just means "let's discuss this." You can second a motion and then vote against it.
TRANSLATION:

KEY: tutorials:member_tip4
EN: <strong>If you're not sure, wait and watch.</strong> The first few minutes will make the rhythm clear. Most of the meeting is: someone proposes, people discuss, everyone votes.
TRANSLATION:

KEY: tutorials:member_tip5
EN: <strong>Check the log</strong> if you missed something. It's in the top bar.
TRANSLATION:

KEY: tutorials:member_tip6
EN: <strong>Your vote counts equally.</strong> That's the whole point.
TRANSLATION:
