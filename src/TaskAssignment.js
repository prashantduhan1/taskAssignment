import React, { useState } from 'react';

const TaskAssignment = () => {
  const [task, setTask] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState({
    // Sample teams and members with priorities
    Team1: [
      { name: 'Member1', priority: 1, taskAssigned: null, tasksAssignedCount: 0 },
      { name: 'Member2', priority: 2, taskAssigned: null, tasksAssignedCount: 0 },
      { name: 'Member3', priority: 3, taskAssigned: null, tasksAssignedCount: 0 },
    ],
    Team2: [
      { name: 'Member4', priority: 2, taskAssigned: null, tasksAssignedCount: 0 },
      { name: 'Member5', priority: 1, taskAssigned: null, tasksAssignedCount: 0 },
    ],
  });
  
  const [assignedMember, setAssignedMember] = useState('');
  const [assignedMemberIndex, setAssignedMemberIndex] = useState(0);

  const assignTask = () => {
    if (!task || !selectedTeam) {
      alert('Please enter task and select a team.');
      return;
    }

    // Find the team based on the selectedTeam value
    const teamMembers = teams[selectedTeam];

    // Sort the team members based on priority in descending order
    const sortedMembers = teamMembers.sort((a, b) => b.priority - a.priority);

    // Calculate the member index to assign the task in a round-robin manner
    let memberIndex = assignedMemberIndex % teamMembers.length;
    let foundAvailableMember = false;

    // Find the next available member to assign the task (skipping members with existing tasks)
    while (!foundAvailableMember) {
      const currentMember = teamMembers[memberIndex];
      if (currentMember.tasksAssignedCount < 1) {
        foundAvailableMember = true;
      } else {
        memberIndex = (memberIndex + 1) % teamMembers.length;
      }
    }

    // Update the assigned task for the selected member
    const updatedTeamMembers = teamMembers.map((member, index) => ({
      ...member,
      taskAssigned: index === memberIndex ? task : member.taskAssigned,
      tasksAssignedCount: index === memberIndex ? member.tasksAssignedCount + 1 : member.tasksAssignedCount,
    }));

    // Get the name of the assigned member
    const assignedMemberName = teamMembers[memberIndex].name;

    // Check if all members have one task assigned
    const allMembersAssignedOneTask = updatedTeamMembers.every((member) => member.tasksAssignedCount >= 1);

    // If all members have one task assigned, reset tasksAssignedCount for all members
    if (allMembersAssignedOneTask) {
      updatedTeamMembers.forEach((member) => (member.tasksAssignedCount = 0));
    }

    // Update the state with the updated member list, assigned member name, and assigned member index
    setTeams({
      ...teams,
      [selectedTeam]: updatedTeamMembers,
    });
    setAssignedMember(assignedMemberName);
    setAssignedMemberIndex(memberIndex + 1); // Update the assignedMemberIndex for the next assignment

    // Clear the input fields after task assignment
    setTask('');
  };

  return (
    <div>
      <h2>Task Assignment</h2>
      <div>
        <label>Task:</label>
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={4}
          cols={50}
          placeholder="Enter task here..."
        />
      </div>
      <div>
        <label>Team:</label>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Select Team</option>
          {Object.keys(teams).map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <button onClick={assignTask}>Assign Task</button>
      {assignedMember && <div>Task assigned to {assignedMember}</div>}
    </div>
  );
};

export default TaskAssignment;
