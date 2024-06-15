module.exports = {
  TEAMS_SETTINGS: {
    NEW_TEAM: 'Create new team',
    HEADER: 'Teams',
    SIDEBAR_TXT:
      '<p><b>Teams</b></p> <p>Teams let you organize your agents into groups based on their responsibilities. {linebreak} An agent can be part of multiple teams. You can assign conversations to a team when you are working collaboratively. </p>',
    LIST: {
      404: 'There are no teams created on this account.',
      EDIT_TEAM: 'Edit team',
    },
    CREATE_FLOW: {
      CREATE: {
        TITLE: 'Create a new team',
        DESC: 'Add a title and description to your new team.',
      },
      AGENTS: {
        BUTTON_TEXT: 'Add agents to team',
        TITLE: 'Add agents to team - %{teamName}',
        DESC: 'Add Agents to your newly created team. This lets you collaborate as a team on conversations, get notified on new events in the same conversation.',
        ADD_AGENTS: 'Add agents',
        UPDATE_AGENTS_IN_TEAM: 'Update agents in team',
        ADD_AGENTS_TO_TEAM: 'Add Agents to team - {teamName}',
        ADD_AGENTS_TO_TEAM_HELP_NEW:
          'Add Agents to your newly created team. This lets you collaborate as a team on conversations, get notified on new events in the same conversation.',
        ADD_AGENTS_TO_TEAM_HELP:
          'Add Agents to your newly created team. All the added agents will be notified when a conversation is assigned to this team.',
        SELECT_ATLEASE_ONE_AGENT_VALIDATION: 'Select atlease one agent',
        AGENTS_SELECTED_COUNT:
          '{selectedCount} out of {totalCount} agents selected.',
        TABLE: {
          AGENT: 'Agent',
          EMAIL: 'Email',
        },
      },
      WIZARD: [
        {
          title: 'Create',
          route: 'settings_teams_new',
          body: 'Create a new team of agents.',
        },
        {
          title: 'Add Agents',
          route: 'settings_teams_add_agents',
          body: 'Add agents to the team.',
        },
        {
          title: 'Finish',
          route: 'settings_teams_finish',
          body: 'You are all set to go!',
        },
      ],
    },
    EDIT_FLOW: {
      CREATE: {
        TITLE: 'Edit your team details',
        DESC: 'Edit title and description to your team.',
        BUTTON_TEXT: 'Update team',
      },
      AGENTS: {
        BUTTON_TEXT: 'Update agents in team',
        TITLE: 'Add agents to team - %{teamName}',
        DESC: 'Add Agents to your newly created team. All the added agents will be notified when a conversation is assigned to this team.',
      },
      WIZARD: [
        {
          title: 'Team details',
          route: 'settings_teams_edit',
          body: 'Change name, description and other details.',
        },
        {
          title: 'Edit Agents',
          route: 'settings_teams_edit_members',
          body: 'Edit agents in your team.',
        },
        {
          title: 'Finish',
          route: 'settings_teams_edit_finish',
          body: 'You are all set to go!',
        },
      ],
    },
    TEAM_FORM: {
      ERROR_MESSAGE: "Couldn't save the team details. Try again.",
    },
    AGENTS: {
      AGENT: 'AGENT',
      EMAIL: 'EMAIL',
      BUTTON_TEXT: 'Add agents',
      ADD_AGENTS: 'Adding Agents to your Team...',
      SELECT: 'select',
      SELECT_ALL: 'select all agents',
      SELECTED_COUNT: '%{selected} out of %{total} agents selected.',
    },
    ADD: {
      TITLE: 'Add agents to team - %{teamName}',
      DESC: 'Add Agents to your newly created team. This lets you collaborate as a team on conversations, get notified on new events in the same conversation.',
      SELECT: 'select',
      SELECT_ALL: 'select all agents',
      SELECTED_COUNT: '%{selected} out of %{total} agents selected.',
      BUTTON_TEXT: 'Add agents',
      AGENT_VALIDATION_ERROR: 'Select atleaset one agent.',
    },

    FINISH: {
      TITLE: 'Your team is ready!',
      MESSAGE:
        'You can now collaborate as a team on conversations. Happy supporting ',
      BUTTON_TEXT: 'Finish',
    },
    DELETE: {
      BUTTON_TEXT: 'Delete',
      API: {
        SUCCESS_MESSAGE: 'Team deleted successfully.',
        ERROR_MESSAGE: "Couldn't delete the team. Try again.",
      },
      CONFIRM: {
        TITLE: 'Are you sure want to delete - {teamName}',
        PLACE_HOLDER: 'Please type "{teamName}" to confirm',
        MESSAGE:
          'Deleting the team will remove the team assignment from the conversations assigned to this team.',
        YES: 'Delete ',
        NO: 'Cancel',
      },
    },
    SETTINGS: 'Settings',
    FORM: {
      UPDATE: 'Update team',
      CREATE: 'Create team',
      NAME: {
        LABEL: 'Team name',
        PLACEHOLDER: 'Example: Sales, Customer Support',
      },
      DESCRIPTION: {
        LABEL: 'Team Description',
        PLACEHOLDER: 'Short description about this team.',
      },
      ACTION: {
        LABEL: 'Action',
      },
      AUTO_ASSIGN: {
        LABEL: 'Allow auto assign for this team.',
      },
      SUBMIT_CREATE: 'Create team',
    },
  },
};