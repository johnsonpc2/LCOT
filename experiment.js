const pavlovia_init = {
  type: jsPsychPavlovia,
  command: "init"
};

const pavlovia_finish = {
  type: jsPsychPavlovia,
  command: "finish"
}

const jsPsych = initJsPsych({
  on_finish: function() {
    // Pavlovia-specific data saving
    jsPsych.data.displayData();
  }
});

// ##### DEFINE THE CONSTANTS AND VARIABLES USED LATER #####
// Store audio files so we can use them later
const audio_files = [
  'melody01_Kalimba_loud.mp3',
  'melody02_Kalimba_loud.mp3',
  'melody03_Kalimba_loud.mp3',
  'melody04_Kalimba_loud.mp3',
  'melody05_Kalimba_loud.mp3',
  'melody06_Kalimba_loud.mp3',
  'melody07_Kalimba_loud.mp3',
  'melody08_Kalimba_loud.mp3',
  'melody09_Kalimba_loud.mp3',
  'melody10_Kalimba_loud.mp3',
  'melody11_Kalimba_loud.mp3',
  'melody12_Kalimba_loud.mp3',
  'melody13_Kalimba_loud.mp3',
  'melody14_Kalimba_loud.mp3',
  'melody15_Kalimba_loud.mp3',
  'melody16_Kalimba_loud.mp3',
  'melody17_Kalimba_loud.mp3',
  'melody18_Kalimba_loud.mp3',
  'melody19_Kalimba_loud.mp3'];

const sample_tone_file = ['melody12_Kalimba_trial_tone.mp3'];

const audio_prefix = [// Isolate the beginning of the audio files
  'melody01_Kalimba', 'melody02_Kalimba', 'melody03_Kalimba',
  'melody04_Kalimba', 'melody05_Kalimba', 'melody06_Kalimba',
  'melody07_Kalimba', 'melody08_Kalimba', 'melody09_Kalimba',
  'melody10_Kalimba', 'melody11_Kalimba', 'melody13_Kalimba',
  'melody14_Kalimba', 'melody15_Kalimba', 'melody17_Kalimba',
  'melody19_Kalimba'
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
task_stimuli = [{
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
  listening: 5 sec/melody, 2 melodies/pair, 24 pair presentations;
  test: 5sec/melody, 2 melodies/pair, 2 pairs/test trial, 10 test trials, + 4 sec/response, 10 responses,
  4 blocks puts us at 32 minutes of listening*/
const num_blocks = 4;

// Create an empty list to hold the entire exposure stream.
var exposure_stream = [];

// ##### SLIDE DEFINITIONS #####
// Trial of the preference task

// ADD DEFINITION FOR EXPOSURE TRIAL HERE

preference_trial = {
  type: jsPsychAudioSliderResponse,
  stimulus: jsPsych.timelineVariable('preference_stim'),
  labels: [
    "Did not like at all",
    "Liked very much"],
  prompt: '<p style=font-size:2vw>Use the slider to indicate how much you like this melody.</p>',
  slider_width: 480,
  min: 0,
  max: 100,
  slider_start: 50,
  response_allowed_while_playing: false,
  post_trial_gap: 1000,
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
  message: '<p style=font-size:2vw>By clicking the "Continue" button below, the experiment will enter fullscreen mode. Please remain in fullscreen mode for the duration of the study. Click the "Continue" button to begin.</p>',
  data: {
    phase: 'fullscreen_agreement'
  }
});

// General task instructions
timeline.push({
  type: jsPsychInstructions,
  pages: [// Each new item in the list shows up on a new page
    '<p style=font-size:4vw>Welcome to the study!</p>',
    '<p style=font-size:2vw>In this study you will complete two tasks: First, you will complete a series of short listening tasks and answer questions about what you hear. You will have the chance to practice one of these listening tasks before starting this portion of the study. After completing the listening tasks, you will complete a questionnaire about yourself and your hearing. The study takes about 40-45 minutes to complete. All responses will remain anonymous.</p>',
    '<p style=font-size:2vw>This study requires you to listen to audio played from your browser and make responses with your keyboard. Please complete the study on a device with a <b>physical</b> keyboard, such as a laptop or desktop computer. Please also ensure you are in a quiet environment. If possible, use headphones or earbuds to complete the task. On the next page you will hear sample sounds like those you will hear later in the study. Lower your volume now, <b>BEFORE</b> continuing, and gradually increase your volume to a comfortable level while the sample audio plays. A quiet audio sample will play, followed by a loud sample. When you are ready, press the "Continue" button to begin.</p>'],
  button_label_next: 'Continue',
  button_label_previous: 'Go back',
  show_clickable_nav: true,
  data: {
    phase: 'intro_instructions'
  } // Record extra data about the slide.
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
    stimulus: 'melody12_Kalimba_trial_tone.mp3',
    choices: ['Play again', 'Continue'], // Option 1 and 2
    prompt: '<p style=font-size:2vw>A soft and loud sample will play. Adjust the volume so both samples can be heard comfortably. Click the "Play Again" button to repeat the samples. Once comfortable, click "Continue" to begin the practice.</p>'
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

// Intermediate slide before the start of the practice phase
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style=font-size:4vw>PRACTICE</p>',
  choices: 'NO_KEYS',
  trial_duration: 2000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_slide_practice'
  }
});

// Practice trial instructions
timeline.push({
  type: jsPsychInstructions,
  pages: [
    '<p style=font-size:2vw>Please press the "ENTER" key on your keyboard immediately anytime you notice the volume of the sound changes. <b>The screen will not change when you press the "ENTER" key</b>; however, your responses <b>will</b> be recorded. If you think you hear a volume change but are unsure, hit the "ENTER" key anyway. Please press the "Continue" button when you are ready to begin practicing.</p>'],
  button_label_next: 'Continue',
  show_clickable_nav: true,
  data: {
    phase: 'practice_instructions'
  }
});

// Practice trial for attention check mechanism. Subjects should press ENTER on trials where "follows_volume_change" = true; timeline index 6
timeline.push({
  type: jsPsychAudioKeyboardResponse,
  prompt: '<p style=font-size:2vw>Press the "ENTER" key when you hear a change in volume. Your response will be recorded but the screen will <b>NOT</b> change when you press the "ENTER" key.</p>',
  choices: ["Enter"],
  response_allowed_while_playing: true,
  response_ends_trial: false,
  trial_ends_after_audio: true,
  data: {
    phase: 'practice_trial'
  },
  // The code above sets the general layout for the practice slides.
  // The code below defines the stimuli to be used on each of the trials of practice//
  // There will be 3 trials as defined in the timeline below
  timeline: [{
    stimulus: 'melody18_Kalimba_soft.mp3',
    data: {
      is_switch: false
    }},
    {
      stimulus: 'melody16_Kalimba_loud.mp3',
      data: {
        is_switch: true
      }},
    {
      stimulus: 'melody18_Kalimba_soft.mp3',
      data: {
        is_switch: true
      }}]
});

// Intermediate slide before the start of the exposure phase
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style=font-size:4vw>LISTENING TASK</p>',
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
    '<p style=font-size:2vw>Like the practice you just completed, press the "ENTER" key immediately anytime you notice the volume of the music changes. Again, the screen <b>will not change</b> when you press the "ENTER" key, but your responses <b>will</b> be recorded. This portion of the study will take just over 15 minutes. Please press the "Continue" button when you are ready to begin.</p>'],
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

  console.log(exposure_block);

  // Test instructions
  timeline.push({
    type: jsPsychInstructions,
    pages: [
      '<p style=font-size:2vw>We will now ask you about the music you just heard. These sequences <b>might</b> be in the same order you heard previously. Please rate your confidence whether the sequences we play now <b>match the SPECIFIC order</b> you heard earlier in the study. Following these questions, you will begin another listening task. Click "Continue" to start.</p>'
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
        prompt: '<p style=font-size:2vw>First pair playing...</p>',
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
        post_trial_gap: 1000,
        prompt: '<p style=font-size:2vw>First pair playing...</p>',
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
        prompt: '<p style=font-size:2vw>Second pair playing...</p>',
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
        post_trial_gap: 1000,
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
        prompt: '<p style=font-size:2vw>First pair playing...</p>',
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
        post_trial_gap: 1000,
        prompt: '<p style=font-size:2vw>First pair playing...</p>',
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
        prompt: '<p style=font-size:2vw>Second pair playing...</p>',
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
        post_trial_gap: 1000,
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
}


// PREFERENCE TASK
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style=font-size:4vw>PREFERENCE TASK</p>',
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
  pages: ['<p style=font-size:2vw>Please state your preference for the music you have heard. Rate how much you liked each of the following on a scale from "Did not like at all" to "Liked very much". Click "Continue" to begin.</p>'],
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
  stimulus: '<p style=font-size:4vw>DEMOGRAPHIC SURVEY</p>',
  choices: 'NO_KEYS',
  trial_duration: 2000,
  response_ends_trial: false,
  data: {
    phase: 'intermediate_slide_demoSurvey'
  }
});

// Individual differences questionnaire text entry
timeline.push({
  type: jsPsychSurveyText,
  questions: [{
    prompt: '<p style=font-size:2vw>What strategies did you use to decide which of the melodies you were more confident you heard earlier in the experiment?</p>', name: "DecisionStrategies", required: false
  },
    {
      prompt: '<p style=font-size:2vw>Do you sing or play a musical instrument? Type "yes" or "no" to respond.</p>', name: "singOrPlay", required: false
    },
    {
      prompt: '<p style=font-size:2vw>If you sing or play a musical instrument, please specify your instrument or voice type (e.g., piano, guitar, soprano, etc.). If you do not, type "N/A".</p>', name: "InstrumentType", required: false
    },
    {
      prompt: '<p style=font-size:2vw>What device are you using to take this survey (e.g., phone, laptop, etc.)?</p>', name: "surveyDevice", required: false
    },
    {
      prompt: '<p style=font-size:2vw>What device are you using to listen to the sounds in this survey (e.g., headphones, laptop speakers, etc.)?</p>', name: "audioDevice", required: false
    },
    {
      prompt: "<p style=font-size:2vw>Was there any point you believe a technical error occurred during the study (i.e., a sound didn't play, something didn't show up, etc.)?</p>", name: "technicalIssues", required: false
    }],
  data: {
    phase: 'individual_diffs_text1'
  }});

// Individual differences questionnaire multiple choice
timeline.push({
  type: jsPsychSurveyMultiChoice,
  questions: [{
    prompt: '<p style=font-size:2vw>Do you identify as a musician?</p>', name: "musicalIdentity", options: ["Yes", "No"], required: false, data: {
      phase: 'musicalIdentity'
    }, vertical: true
  },
    {
      prompt: '<p style=font-size:2vw>If you sing or play a musical instrument, approximately how many years have you been doing so?</p>', name: "musicalExperience", options: ["I do not sing or play an instrument", "Less than 1 year", "1-2 years", "2-3 years", "3-4 years", "4-5 years", "5-10 years", "More than 10 years"], required: false, data: {
        phase: 'musicalExperience'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>If you sing or play a musical instrument, approximately how long has it been since you have sung or played consistently?</p>', name: "timesinceMusicalExperience", options: ["I do not sing or play an instrument", "Less than 1 year", "1-2 years", "2-3 years", "3-4 years", "4-5 years", "5-10 years", "More than 10 years"], required: false, data: {
        phase: 'timesinceMusicalExperience'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>How important is music to you?</p>', name: "musicalImportance", options: ["Not at all important", "Slightly important", "Moderately important", "Very important", "Extremely important"], required: false, data: {
        phase: 'musicalImportance'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>How motivated are you to complete this survey accurately?</p>', name: "motivation", options: ["Not at all motivated", "Slightly motivated", "Moderately motivated", "Very motivated", "Extremely motivated"], required: false, data: {
        phase: 'musicalmotivation'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Approximately how many other surveys have you taken that involved listening to audio (e.g., sound clips, music, etc.)?</p>', name: "audioSurveyExperience", options: ["0", "1-2", "3-4", "5 or more"], required: false, data: {
        phase: 'audioSurveyExperience'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Do you have normal or corrected-to-normal hearing?</p>', name: "normalHearing", options: ["Yes", "No"], required: false, data: {
        phase: 'normalHearing'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Do you have a history of inner ear infections/tubes?</p>', name: "earHealth1", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth1'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Do you have a history of excessive ear wax or similar conditions?</p>', name: "earHealth2", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth2'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Have you been diagnosed with any kind of abnormal ear anatomy (e.g., small ear canals)?</p>', name: "earHealth3", options: ["Yes", "No"], required: false, data: {
        phase: 'earHealth3'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Do you use any kind of hearing aid device?</p>', name: "hearingAid", options: ["Yes", "No"], required: false, data: {
        phase: 'hearingAid'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Do you have hearing loss in either of your ears?</p>', name: "hearingLoss", options: ["Yes - hearing loss in left ear", "Yes - hearing loss in right ear", "Yes - hearing loss in both ears", "No", "Unsure"], required: false, data: {
        phase: 'hearingLoss'
      }, vertical: true
    },
    {
      prompt: '<p style=font-size:2vw>Please indicate your hearing ability without a hearing aid:</p>', name: "hearingAbility", options: ["Deaf", "Poor", "Average", "Good", "Excellent"], required: false, data: {
        phase: 'hearingAbility'
      }, vertical: true
    }],
  data: {
    phase: 'individual_diffs_multipleChoice'
  }});

// Demographics survey: a block for entering age, gender, and race
var demographics_age = {
  type: jsPsychSurveyText,
  questions: [{
    prompt: '<p style=font-size:2vw>Please enter your age in numerals (e.g., "24")</p>',
    name: 'age',
    required: false
  }],
  data: {
    phase: 'demographics_survey'
  }};

var demographics_gender = {
  type: jsPsychSurveyMultiSelect,
  questions: [{
    prompt: '<p style=font-size:2vw>Which of the following gender identities best describes you? Please select all that apply.</p>',
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
    prompt: '<p style=font-size:2vw>If you selected "Other", please specify. If you chose another option please answer "N/A"</p>',
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
    prompt: '<p style=font-size:2vw>Which of the following best describes you?</p>',
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
    '<p style=font-size:2vw>Thank you for completing the study.</p>',
    '<p style=font-size:2vw>The researcher\'s goal is to examine the relationship between memory and prediction for music, specifically, how memory for music develops over time and how the predictability of music influences preference for a song. With the data you have provided, we will be able to see, for example, if memory for a melody and the ability to predict when a melody will be heard influences how much a person likes that melody. If you have any questions, please contact the researcher (pjohnson4@albany.edu).</p>',
    '<p style=font-size:2vw>You may now close the study by hitting the "Continue" button.</p>'],
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
