const pavlovia_init = {
  type: jsPsychPavlovia,
  command: "init"
};

const pavlovia_finish = {
  type: jsPsychPavlovia,
  command: "finish"
};

const jsPsych = initJsPsych({
});

// ##### DEFINE THE CONSTANTS AND VARIABLES USED LATER #####
// Store audio files so we can use them later
const audio_files = [
  'audio/melody01_Kalimba_loud.mp3',
  'audio/melody02_Kalimba_loud.mp3',
  'audio/melody03_Kalimba_loud.mp3',
  'audio/melody04_Kalimba_loud.mp3',
  'audio/melody05_Kalimba_loud.mp3',
  'audio/melody06_Kalimba_loud.mp3',
  'audio/melody07_Kalimba_loud.mp3',
  'audio/melody08_Kalimba_loud.mp3',
  'audio/melody09_Kalimba_loud.mp3',
  'audio/melody10_Kalimba_loud.mp3',
  'audio/melody11_Kalimba_loud.mp3',
  'audio/melody12_Kalimba_loud.mp3',
  'audio/melody13_Kalimba_loud.mp3',
  'audio/melody14_Kalimba_loud.mp3',
  'audio/melody15_Kalimba_loud.mp3',
  'audio/melody16_Kalimba_loud.mp3',
  'audio/melody17_Kalimba_loud.mp3',
  'audio/melody18_Kalimba_loud.mp3',
  'audio/melody19_Kalimba_loud.mp3'];

const sample_tone_file = ['audio/melody21_Kalimba_loud.mp3'];

const audio_prefix = [// Isolate the beginning of the audio files
  'audio/melody01_Kalimba', 'audio/melody02_Kalimba', 'audio/melody03_Kalimba',
  'audio/melody04_Kalimba', 'audio/melody05_Kalimba', 'audio/melody06_Kalimba',
  'audio/melody07_Kalimba', 'audio/melody08_Kalimba', 'audio/melody09_Kalimba',
  'audio/melody10_Kalimba', 'audio/melody11_Kalimba', 'audio/melody13_Kalimba',
  'audio/melody14_Kalimba', 'audio/melody15_Kalimba', 'audio/melody17_Kalimba',
  'audio/melody19_Kalimba'
];

// The "role" of each fragment is defined by its index in the "assigned_files" list.
// Because this list is a random shuffle of the original audio file names, it randomizes the assignment of file to role for each participant.
const assigned_files = jsPsych.randomization.shuffle(audio_prefix);

// These are the "units" the exposure stream is composed from. Each is itself a list.  The elements of each unit are indices of the "assigned_files" list. This arrangement takes 4 minutes to go through
const study_units = [
  [0, 1], [0, 1], [0, 1], [0, 1], [2, 3], [2, 3], [2, 3], [2, 3], // 100% Contingent
  [4, 5], [4, 5], [4, 5], [4, 7], [6, 7], [6, 7], [6, 7], [6, 5], // 75% Contingent
  [8, 9], [8, 9], [8, 11], [8, 11], [10, 11], [10, 11], [10, 9], [10, 9] // 50% Contingent
];

// Hard-coded structure of the stimuli for the exposure blocks
var task_stimuli = [{
  intact: [0,
    1],
  rearranged: [0,
    3],
  contingency: 100
},
  {
    intact: [2,
      3],
    rearranged: [2,
      1],
    contingency: 100
  },
  {
    intact: [4,
      5],
    rearranged: [4,
      7],
    contingency: 75
  },
  {
    intact: [6,
      7],
    rearranged: [6,
      5],
    contingency: 75
  },
  {
    intact: [8,
      9],
    rearranged: [8,
      11],
    contingency: 50
  },
  {
    intact: [10,
      11],
    rearranged: [10,
      9],
    contingency: 50
  }];

// Define blocks in listening task—each a new order of "study_units"
/* Each listening + test block takes 8 minutes:
  listening: 5 sec/melody, 2 melodies/pair, 24 pair presentations; 4 min total
  test: 5 sec/melody, 2 melodies/pair, 2 pairs/test trial, 10 test trials, + 4 sec/response, 10 responses; 4 min total
  4 blocks puts us at 32 minutes of listening and test*/
const num_blocks = 4;

// Create an empty list to hold the entire exposure stream.
var exposure_stream = [];

// ##### SLIDE DEFINITIONS #####
// Trial of the preference task
preference_trial = {
  type: jsPsychAudioSliderResponse,
  stimulus: jsPsych.timelineVariable('preference_stim'),
  labels: [
    "Not at all",
    "Very much"],
  prompt: '<p style="font-size:1.5vw">How much do you like this melody?</p>',
  slider_width: 480,
  min: 0,
  max: 100,
  slider_start: 50,
  response_allowed_while_playing: false,
  post_trial_gap: 500,
  require_movement: true,
  data: {
    phase: 'preference_test_trial',
    component_id: jsPsych.timelineVariable('component_id')
  }};

// ##### TIMELINE CODE #####
const timeline = []; // Creates empty array to fill with procedure

timeline.push(pavlovia_init)

// This initialization screen forces participants to use fullscreen
// mode to limit distractions outside the task
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: '<p style="font-size:1.5vw">Click the "Continue" button to enter fullscreen mode and remain in fullscreen mode for the duration of the study. On the next page you will read the informed consent and begin the study.</p>',
  data: {
    phase: 'fullscreen_agreement'
  }
});

// Informed Consent
timeline.push({
  type: jsPsychInstructions,
  pages: [// Each new item in the list shows up on a new page
    "<p style='font-size:1.5vw'>We are researchers at the University at Albany in the Department of Psychology, conducting a research study in which we now invite you to take part. <br><br>The following pages have important information about this study's purpose, what we will ask you to do if you decide to participate, and the way we would like to use the information we gather if you choose to be in the study.</p>",
    "<p style='font-size:1.5vw'>You are being asked to participate in a research study about music and people's hearing ability. The purpose of this study is to investigate what people prefer and remember about music. Your participation will help us better understand what people notice about music and how people gather and remember information about what they experience in general. <br><br>You will listen to music for about 30 minutes, and then will be asked questions about what you heard. Then, you will answer demographic questions about yourself and share basic information about your hearing. All responses will be anonymous, and we will not collect any data linking your name or identity with your data. <br><br>You will be provided with our contact information in case you have any questions about our research.</p>",
    "<p style='font-size:1.5vw'>Study participation will take place at a time of your choosing. Once you begin, you will need to complete the study in one sitting. Participation will take approximately 45 minutes. All study procedures will take place online. <br><br>We ask that you complete the study in a quiet environment to minimize distractions. You will have to listen to music throughout this study, please complete the study with headphones or earbuds so you can clearly hear the music played in your web browser.</p>",
    "<p style='font-size:1.5vw'>The risks associated with this study are no greater than those you might encounter in everyday life. You may experience mild emotional discomfort answering questions about your identity. <br><br>Music will play in your browser throughout the study, and you will be warned in advance to lower the volume of your computer so you don't experience hearing discomfort.<br><br> As with all research, there is a chance that confidentiality of the information we collect from you could be breached; we will take steps to minimize this risk, as discussed in more detail below.</p>",
    "<p style='font-size:1.5vw'>To minimize the risks to confidentiality, we de-identify all information collected throughout the study. We may share the data we collect from you for use in future research studies or with other researchers; before analyzing any data you provide, we will remove any personally identifiable information. Further, if we share the data you provide as part of this study, we will ensure you cannot be identified before we share it. All data will be stored on secure drives and will be analyzed on password protected computers.</p>",
    "<p style='font-size:1.5vw'>Participation in this study will involve no cost to you. You will receive 1 credit in extra course credit in exchange for your participation. <br><br>Though there is no direct benefit of taking part in this research besides earning extra credit in your course, the information gathered in this study will help us better understand how people learn from, remember, and form preferences of  their experiences.</p>",
    "<p style='font-size:1.5vw'>Participation in this study is voluntary. You do not have to answer any question you do not want to answer. If at any time you would like to stop participating, you are free to do so. You may withdraw from this study at any time, and you will not be penalized in any way for deciding to stop participation. <br><br>You may choose not to participate or to stop participating in this research at any time. This will not affect your class standing, grades, employment, or any other aspects of your relationship with the University at Albany.</p>",
    "<p style='font-size:1.5vw'>If you have questions after participation in this study, you may contact the researchers at pjohnson4@albany.edu (PI), or gecox@albany.edu (Co-PI). <br><br>If you have any questions about your rights as a participant in this research, you can contact the following office at the University at Albany: <br><br>Institutional Review Board <br>University at Albany <br>Office of Regulatory and Research Compliance <br>1400 Washington Ave, ES 244 <br>Albany, NY 12222 <br>Phone: 1-866-857-5459 <br>Email: rco@albany.edu</p>",
    "<p style='font-size:1.5vw'>I have read this form and the research study has been explained to me. I have been given the opportunity to ask questions and my questions have been answered. If I have additional questions, I have been told whom to contact. By clicking the button below, I agree to participate in the research study described above.</p>"],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'informed_consent'
  } // Record extra data about the slide.
});

// General task instructions
timeline.push({
  type: jsPsychInstructions,
  pages: [
    '<p style="font-size:4vw">Welcome!</p><br><br><p style="font-size:1.5vw">Thanks for reading and agreeing to the consent form. In this study you will complete two tasks: First, you will complete a series of short listening tasks and answer questions about what you hear. After completing the listening tasks, you will complete a questionnaire about yourself and your hearing. The study takes about 40-45 minutes to complete. All responses will remain anonymous.</p>',
    '<p style="font-size:1.5vw">You will be required to listen to audio played from your browser and make responses with your keyboard. Please complete the study on a device with a <b>physical</b> keyboard, such as a laptop or desktop computer. Please also ensure you are in a quiet environment. If possible, use headphones or earbuds to complete the task. On the next page you will hear sample melodies like those you will hear later in the study. Lower your volume now <b>before</b> continuing, and gradually increase your volume to a comfortable level while the sample audio plays. When you are ready, press the "Continue" button to move to the next page.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'intro_instructions'
  }
});

// Preload audio files from above to play later without lag
timeline.push({
  type: jsPsychPreload,
  audio: [audio_files, sample_tone_file],
  data: {
    phase: 'audio_preload'
  }
});

// Play sample melody when 'Play Again' is pressed, then continue. The loop is embedded in the timeline for the slide, so you remain in that timeline until you press the 'Continue' button
timeline.push({
  timeline: [{
    type: jsPsychAudioButtonResponse,
    stimulus: sample_tone_file,
    choices: ['Play again', 'Continue'], // Option 1 and 2
    prompt: '<p style="font-size:1.5vw">Adjust the volume so the audio can be heard comfortably. Click the "Play Again" button to repeat the sample. Once comfortable, click "Continue" to begin the listening task.</p>'
  }],
  response_allowed_while_playing: false,
  loop_function: function(data) {
    if (data.values()[0].response == 0) {
      return true; // Loop if the first option on the page is selected!
    } else {
      return false; // When the second option is selected, move on!
    }
  },
  data: {
    phase: 'volume_adjust'
  }
});

// YOU DELETED THE INTERMEDIATE SLIDE BEFORE THE PRACTICE, THE PRACTICE INSTRUCTIONS, AND THE PRACTICE ITSELF. THIS IS WHERE IT WENT.

// Intermediate slide before the start of the exposure phase
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:4vw">LISTENING TASK</p>',
  choices: 'NO_KEYS',
  trial_duration: 2000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_slide_exposure'
  }
});

// Exposure Phase instructions
timeline.push({
  type: jsPsychInstructions,
  pages: [
    '<p style="font-size:1.5vw">This portion of the study will take around 30 minutes. You will hear a stream of melodies. Some of these melodies may repeat and you may notice patterns in the stream of audio. Please pay careful attention because you will be asked questions about what you hear. Please press the "Continue" button to begin.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'exposure_instructions'
  }
});

// Within the following loop, each block is created and appended to the stream.
for (var block_index = 0; block_index < num_blocks; block_index++) {

  var exposure_block = [];

  var block_units = jsPsych.randomization.shuffle(study_units); // Randomize the order the melodies are played

  // Append audio files to exposure stream in the order they were shuffled to occur.
  for (var unit_index = 0; unit_index < block_units.length; unit_index++) {

    // Because each "unit" can have multiple components, we must loop through each component within the current unit.
    for (var component_index = 0; component_index < block_units[unit_index].length; component_index++) {

      exposure_block.push({
        component_id: block_units[unit_index][component_index],
        stimulus: assigned_files[block_units[unit_index][component_index]] + '_loud.mp3',
        block: block_index
      });
    }
  }

  // Assigns the timeline variables from the exposure stream we just created
  var trial_1 = {
      type: jsPsychAudioKeyboardResponse,
      stimulus: jsPsych.timelineVariable("stimulus"),
      response_allowed_while_playing: false,
      response_ends_trial: false,
      trial_ends_after_audio: true,
      prompt: "<p style=font-size:1.3vw>Sound is playing...</p>",
      data: {
        component_id: jsPsych.timelineVariable("component_id"),
        block: jsPsych.timelineVariable("block"),
        phase: "exposure_stream_trial"
      }
  };

// Plays audio of the exposure stream using the timeline variable assignments above
  timeline.push({
    timeline: [trial_1],
    timeline_variables: exposure_block});

  // Test instructions
  timeline.push({
    type: jsPsychInstructions,
    pages: [
      '<p style="font-size:1.5vw"> We will play you two pairs of melodies; you may have heard one pair more often than the other during the listening task from a moment ago. Please rate your confidence regarding which of the two pairs you heard more often during the listening task. Following these questions, you will listen to more melodies. Click "Continue" to start.</p>'
    ],
    button_label_next: 'Continue',
    button_label_previous: 'Go back',
    show_clickable_nav: true,
    data: {
      phase: 'test_instructions'
    }
  });

  timeline.push({
    // Preload audio files from above to play later without lag; timeline index 2
    type: jsPsychPreload,
    audio: [audio_files],
    data: {
      phase: 'audio_preload'
    }
  });

  task_stimuli = jsPsych.randomization.shuffle(task_stimuli);

  for (var test_index = 0; test_index < task_stimuli.length; test_index++) {

    if (Math.random() < 0.5) {
      var intact_first = true;

    } else {
      var intact_first = false;

    }

    if (intact_first) {

      // This is the template definition of the listening trial slides
      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].intact[0]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        prompt: '<p style="font-size:1.5vw">First pair playing...</p>',
        post_trial_gap: 0,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_1',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "intact",
          component_id: task_stimuli[test_index].intact[0]
        }
      });

      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].intact[1]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        post_trial_gap: 500,
        prompt: '<p style="font-size:1.5vw">First pair playing...</p>',
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_1',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "intact",
          component_id: task_stimuli[test_index].intact[1]
        }
      });

      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].rearranged[0]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        prompt: '<p style="font-size:1.5vw">Second pair playing...</p>',
        post_trial_gap: 0,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_2',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "rearranged",
          component_id: task_stimuli[test_index].rearranged[0]
        }
      });

      timeline.push({
        type: jsPsychAudioSliderResponse,
        labels: ["Pair 1", "Equally often", "Pair 2"],
        prompt: "Pair 2 playing... Use the slider to indicate your confidence which of the two pairs you heard more often.",
        stimulus: assigned_files[task_stimuli[test_index].rearranged[1]] + '_loud.mp3',
        slider_width: 480,
        min: 0,
        max: 100,
        slider_start: 50,
        response_allowed_while_playing: false,
        post_trial_gap: 500,
        require_movement: true,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_2',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "rearranged",
          component_id: task_stimuli[test_index].rearranged[1]
        }
      });

    } else {

      // This is the template definition of the listening trial slides
      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].rearranged[0]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        prompt: '<p style="font-size:1.5vw">First pair playing...</p>',
        post_trial_gap: 0,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_1',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "rearranged",
          component_id: task_stimuli[test_index].rearranged[0]
        }
      });

      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].rearranged[1]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        post_trial_gap: 500,
        prompt: '<p style="font-size:1.5vw">First pair playing...</p>',
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_1',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "rearranged",
          component_id: task_stimuli[test_index].rearranged[1]
        }
      });

      timeline.push({
        type: jsPsychAudioKeyboardResponse,
        stimulus: assigned_files[task_stimuli[test_index].intact[0]] + '_loud.mp3',
        choices: ['NO_KEYS'],
        response_allowed_while_playing: false,
        response_ends_trial: false,
        trial_ends_after_audio: true,
        prompt: '<p style="font-size:1.5vw">Second pair playing...</p>',
        post_trial_gap: 0,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_2',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "intact",
          component_id: task_stimuli[test_index].intact[0]
        }
      });

      timeline.push({
        type: jsPsychAudioSliderResponse,
        labels: ["Pair 1", "Equally often", "Pair 2"],
        prompt: "Pair 2 playing... Use the slider to indicate your confidence which of the two pairs you heard more often.",
        stimulus: assigned_files[task_stimuli[test_index].intact[1]] + '_loud.mp3',
        slider_width: 480,
        min: 0,
        max: 100,
        slider_start: 50,
        response_allowed_while_playing: false,
        post_trial_gap: 500,
        require_movement: true,
        data: {
          block: block_index + 1,
          phase: 'memory_trial_pair_2',
          contingency: task_stimuli[test_index].contingency,
          intact_first: intact_first,
          pair_type: "intact",
          component_id: task_stimuli[test_index].intact[1]
        }
      });

    }

  };

  // Insert a slide here at the end of the test phase of each of the four blocks to thank them for answering questions, and indicate that they're about to hear more melodies
  if (block_index < num_blocks - 1) {

    timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:1.5vw">Thanks for listening and answering questions about what you have heard so far. You are about to hear more pairs and decide which you hear more often.</p>',
  choices: 'NO_KEYS',
  trial_duration: 8000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_listening_test_slide'
    }
  });

  } else {

    timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:1.5vw">Thanks for listening and answering questions! You have completed this portion of the study. Now you will complete a preference rating task.</p>',
  choices: 'NO_KEYS',
  trial_duration: 10000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_listening_test_slide'
    }
  });

  }

}


// PREFERENCE TASK
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:4vw">PREFERENCE TASK</p>',
  choices: 'NO_KEYS',
  trial_duration: 2000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_slide_preference'
  }
});

// Preference Instructions
timeline.push({
  type: jsPsychInstructions,
  pages: ['<p style="font-size:1.5vw">In this portion of the study, we will ask you how you prefer the melodies you have heard. Rate how much you liked each of the following on a scale from "Not at all" to "Very much". This portion will only take a couple minutes. Click "Continue" to begin.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'preference_instructions'
  }
});

timeline.push({
  // Preload audio files from above to play later without lag; timeline index 2
  type: jsPsychPreload,
  audio: [audio_files],
  data: {
    phase: 'audio_preload'
  }
});

// Create an empty array filled with the filenames of audio from assigned_files
var preference_stims = [];

for (var preference_index = 0; preference_index < assigned_files.length; preference_index++) {
  preference_stims.push({
    preference_stim: assigned_files[preference_index] + '_loud.mp3', component_id: preference_index
  })
};

// Put all the pieces together -- the preference trial, and initialize the preference_stims outlined above
timeline.push({
  timeline: [preference_trial],
  timeline_variables: preference_stims,
  randomize_order: true
});

// DEMOGRAPHIC SURVEY QUESTIONS
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size:4vw">DEMOGRAPHIC SURVEY</p>',
  choices: 'NO_KEYS',
  trial_duration: 2000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_slide_demoSurvey'
  }
});

// General task instructions
timeline.push({
  type: jsPsychInstructions,
  pages: [// Each new item in the list shows up on a new page
    '<p style="font-size:2.5vw">Thanks for completing everything in the study so far. You are almost done!</p>',
    '<p style="font-size:1.5vw">The final task in the study is a demographic questionnaire. Please answer the following questions to the best of your ability. Click "Continue" to begin.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'demo_instructions'
  } // Record extra data about the slide.
});

// Individual differences questionnaire text entry
timeline.push({
  type: jsPsychSurveyText,
  questions: [{
    {prompt: '<p style="font-size:1.5vw">What strategies did you use to decide which of the melodies you were more confident you heard earlier in the experiment?</p>', name: "DecisionStrategies", required: false},
    {prompt: '<p style="font-size:1.5vw">Do you sing or play a musical instrument? Type "yes" or "no" to respond.</p>', name: "singOrPlay", required: false},
    {prompt: '<p style="font-size:1.5vw">If you sing or play a musical instrument, please specify your instrument or voice type (e.g., piano, guitar, soprano, etc.). If you do not, type "N/A".</p>', name: "InstrumentType", required: false},
    {prompt: '<p style="font-size:1.5vw">What device are you using to take this survey (e.g., phone, laptop, etc.)?</p>', name: "surveyDevice", required: false},
    {prompt: '<p style="font-size:1.5vw">What device are you using to listen to the sounds in this survey (e.g., headphones, laptop speakers, etc.)?</p>', name: "audioDevice", required: false},
    {prompt: "<p style='font-size:1.5vw'>Was there any point you believe a technical error occurred during the study (i.e., a sound didn't play, something didn't show up, etc.)?</p>", name: "technicalIssues", required: false}],
  data: {
    phase: 'individual_diffs_text1'
  }});

// Individual differences questionnaire multiple choice
timeline.push({
  type: jsPsychSurveyMultiChoice,
  questions: [{
    prompt: '<p style="font-size:1.5vw">Do you identify as a musician?</p>', name: "musicalIdentity", options: ["Yes", "No"], required: false, data: {
      phase: 'musicalIdentity'
    }, vertical: true
  },
    {
      prompt: '<p style="font-size:1.5vw">If you sing or play a musical instrument, approximately how many years have you been doing so?</p>', name: "musicalExperience", options: ["I do not sing or play an instrument", "Less than 1 year", "1-2 years", "2-3 years", "3-4 years", "4-5 years", "5-10 years", "More than 10 years"], required: false, data: {
        phase: 'musicalExperience'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">If you sing or play a musical instrument, approximately how long has it been since you have sung or played consistently?</p>', name: "timesinceMusicalExperience", options: ["I do not sing or play an instrument", "Less than 1 year", "1-2 years", "2-3 years", "3-4 years", "4-5 years", "5-10 years", "More than 10 years"], required: false, data: {
        phase: 'timesinceMusicalExperience'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">How important is music to you?</p>', name: "musicalImportance", options: ["Not at all important", "Slightly important", "Moderately important", "Very important", "Extremely important"], required: false, data: {
        phase: 'musicalImportance'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">How motivated are you to complete this survey accurately?</p>', name: "motivation", options: ["Not at all motivated", "Slightly motivated", "Moderately motivated", "Very motivated", "Extremely motivated"], required: false, data: {
        phase: 'musicalMotivation'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Approximately how many other surveys have you taken that involved listening to audio (e.g., sound clips, music, etc.)?</p>', name: "audioSurveyExperience", options: ["0", "1-2", "3-4", "5 or more"], required: false, data: {
        phase: 'audioSurveyExperience'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Do you have normal or corrected-to-normal hearing?</p>', name: "normalHearing", options: ["Yes", "No"], required: false, data: {
        phase: 'normalHearing'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Do you have a history of inner ear infections/tubes?</p>', name: "earHealth1", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth1'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Do you have a history of excessive ear wax or similar conditions?</p>', name: "earHealth2", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth2'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Have you been diagnosed with any kind of abnormal ear anatomy (e.g., small ear canals)?</p>', name: "earHealth3", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth3'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Do you use any kind of hearing aid device?</p>', name: "hearingAid", options: ["Yes", "No"], required: false, data: {
        phase: 'hearingAid'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Do you have hearing loss in either of your ears?</p>', name: "hearingLoss", options: ["Yes - hearing loss in left ear", "Yes - hearing loss in right ear", "Yes - hearing loss in both ears", "No", "Unsure"], required: false, data: {
        phase: 'hearingLoss'
      }, vertical: true
    },
    {
      prompt: '<p style="font-size:1.5vw">Please indicate your hearing ability without a hearing aid:</p>', name: "hearingAbility", options: ["Deaf", "Poor", "Average", "Good", "Excellent"], required: false, data: {
        phase: 'hearingAbility'
      }, vertical: true
    }],
    ,
    on_finish: function(data) {
     const responses = JSON.parse(data.response);
     
     data.musicalIdentity = responses.musicalIdentity;
     data.musicalExperience = responses.musicalExperience;
     data.timesinceMusicalExperience = responses.timesinceMusicalExperience;
     data.musicalImportance = responses.musicalImportance;
     data.motivation = responses.musicalMotivation;
     data.audioSurveyExperience = responses.audioSurveyExperience;
     data.normalHearing = responses.normalHearing;
     data.earHealth1 = responses.earHealth1;
     data.earHealth2 = responses.earHealth2;
     data.earHealth3 = responses.earHealth3;
     data.hearingAid = responses.hearingAid;
     data.hearingLoss = responses.hearingLoss;
     data.hearingAbility = responses.hearingAbility;
     
     delete data.response;
   },
  data: {
    phase: 'individual_diffs_multipleChoice'
  }});

// Demographics survey: a block for entering age, gender, and race
var demographics_age = {
  type: jsPsychSurveyText,
  questions: [{
    prompt: '<p style="font-size:1.5vw">Please enter your age in numerals (e.g., "24")</p>',
    name: 'age',
    required: false
  }],
  data: {
    phase: 'demographics_survey'
  },
  on_finish: function(data){
                data.response = JSON.stringify(data.response.age);
            }};

var demographics_gender = {
  type: jsPsychSurveyMultiSelect,
  questions: [{
    prompt: '<p style="font-size:1.5vw">Which of the following gender identities best describes you? Please select all that apply.</p>',
    name: 'gender',
    options: [
      "Woman",
      "Man",
      "Transgender Woman",
      "Transgender Man",
      "Non-binary/gender non-conforming",
      "Other",
      "Prefer not to say"],
    required: false,
    vertical: true
  }],
  data: {
    phase: 'demographics_gender'
  }};

var demographics_gender_other = {
  type: jsPsychSurveyText,
  questions: [{
    prompt: '<p style="font-size:1.5vw">If you selected "Other", please specify. If you chose another option please answer "N/A"</p>',
    name: 'gender_other',
    required: false,
    vertical: true
  }],
  data: {
    phase: 'demographics_gender_other'
  }};

var demographics_race = {
  type: jsPsychSurveyMultiChoice,
  questions: [{
    prompt: '<p style="font-size:1.5vw">Which of the following best describes you?</p>',
    name: 'race',
    options: [
      "Asian or Pacific Islander",
      "Black or African American",
      "Hispanic or Latino",
      "Indigenous or Native American",
      "White or Caucasian",
      "Multiracial"],
    required: false,
    vertical: true
  }],
  data: {
    phase: 'demographics_race'
  }};

timeline.push(demographics_age);
timeline.push(demographics_gender);
timeline.push(demographics_gender_other);
timeline.push(demographics_race);

// Debriefing redirects people to the Sona login page
timeline.push({
  type: jsPsychInstructions,
  pages: [
    '<p style="font-size:1.5vw">Thank you for completing the study! Click "Continue" to move to the debriefing on the next page and receive credit for your participation.</p>',
    "<p style='font-size:1.5vw'>The researcher's goal is to examine the relationship between memory and prediction for music, specifically, how memory for music develops over time and how the predictability of music influences preference for a song. With the data you have provided, we will be able to see, for example, if memory for a melody and the ability to predict when a melody will be heard influences how much a person likes that melody. If you have any questions, please contact the researcher (pjohnson4@albany.edu).</p>",
    '<p style="font-size:1.5vw">By hitting the "Continue" button on this page, you will complete the study and indication of your participation will be sent to the Sona pool so you earn credit for participating.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'debriefing'
  }
});

timeline.push(pavlovia_finish)

// Runs the timeline we created with all the code we've put on it
jsPsych.run(timeline);

console.log(timeline);
