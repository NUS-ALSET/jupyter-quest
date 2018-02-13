// test for assignments collection

const assert = require('assert');
const targaryen = require('targaryen');

const customDatabase = {
  courseMembers: {
    course1Id: {
      member1Id: true,
    },
  },
  courses: {
    course1Id: {
      otherFilld: 'otherFilld',
      owner: 'ownerId',
    },
  },
  assignments: {
    course1Id: {
      assignment1Id: {
        title: 'Test Assignment 1',
      },
    },
  },
};

const assignmentsRules = {
  rules: {
    assignments: {
      $courseKey: {
        '.read':
          "auth != null && root.child('courses/' + $courseKey).exists() && (root.child('courseMembers/' + $courseKey + '/' + auth.uid).exists() || root.child('courses/' + $courseKey + '/owner').val() == auth.uid)",
        '.write':
          "auth != null && root.child('courses/' + $courseKey).exists() && root.child('courses/' + $courseKey + '/owner').val() == auth.uid",
      },
    },
  },
};

const read = (ref, auth) => {
  const database = targaryen
    .database(assignmentsRules, customDatabase)
    .as(auth)
    .with({ debug: true });
  const { allowed, info } = database.read(ref);

  //console.log('Rule evaluations:\n', info);
  //assert.ok(allowed);
  if (allowed) {
    console.log(`Read was allowed\n`);
  } else {
    console.log(`Read was denied\n`);
  }
};

const write = (ref, data, auth) => {
  const database = targaryen
    .database(assignmentsRules, customDatabase)
    .as(auth)
    .with({ debug: true });
  const { allowed, newDatabase, info } = database.write(ref, data);
  if (allowed) {
    console.log(`Write was allowed\n`);
  } else {
    console.log(`Write was denied\n`);
  }
  // console.log('Rule evaluations:\n', info);
  // assert.ok(allowed);
  assert.equal(newDatabase.rules, database.rules);
  assert.equal(newDatabase.auth, auth);
  return newDatabase.root;
};

const checkforOwner = () => {
  console.log(`==> AS A OWNER <==\n`);
  let ref = 'assignments/course1Id';
  const auth = { uid: 'ownerId' };
  const data = { title: 'Test Assignment 2' };
  read(ref, auth);
  const root = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);
};

const checkforCoursesMember = () => {
  console.log(`==> AS A COURSE'S MEMBER, (enrolled in course) <==\n`);
  let ref = 'assignments/course1Id';
  const auth = { uid: 'member1Id' };
  const data = { title: 'Test Assignment 2' };
  read(ref, auth);
  const root = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);
};

const checkforUserWithAuth = () => {
  console.log(`==> AS A ANONYMOUS USER (AUTH == NULL) <==\n`);
  let ref = 'assignments/course1Id';
  const auth = null;
  const data = { title: 'Test Assignment 2' };
  read(ref, auth);
  const root = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);
};

const checkforUserWithoutAuth = () => {
  console.log(`==> AS A USER (AUTH != NULL) (not enrolled in course) <==\n`);
  let ref = 'assignments/course1Id';
  const auth = { uid: 'randonId' };
  const data = { title: 'Test Assignment 2' };
  read(ref, auth);
  const root = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);
};

const initChecks = () => {
  console.log(`\n========== Firebase Rules Test For Assignments Collection ==========\n`);
  checkforOwner();
  checkforCoursesMember();
  checkforUserWithAuth();
  checkforUserWithoutAuth();
};

module.exports = initChecks;
