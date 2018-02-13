// test for assignments collection

const assert = require('assert');
const targaryen = require('targaryen');
const colors = require('colors');
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

/**
 *  '.read':
          "auth != null && root.child('courses/' + $courseKey).exists() && (root.child('courseMembers/' + $courseKey + '/' + auth.uid).exists() || root.child('courses/' + $courseKey + '/owner').val() == auth.uid)",
 */
const assignmentsRules = {
  rules: {
    assignments: {
      $courseKey: {
        '.read': "auth != null && root.child('courses/' + $courseKey).exists()",
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
  return allowed;
};

const write = (ref, data, auth) => {
  const database = targaryen
    .database(assignmentsRules, customDatabase)
    .as(auth)
    .with({ debug: true });
  const { allowed, newDatabase, newValue, info } = database.write(ref, data);
  assert.equal(newDatabase.rules, database.rules);
  assert.equal(newDatabase.auth, auth);
  return { writeAllowed: allowed, root: newDatabase.root };
};
const print = (expectation, readAllowed, writeAllowed) => {
  console.log(`Expect : read : ${expectation.read} && write : ${expectation.write}\n`.yellow);
  console.log(`Result : read : ${readAllowed} && write : ${writeAllowed}\n`.yellow);
  if (expectation.read === readAllowed && expectation.write === writeAllowed) {
    console.log(`TEST PASS\n`.green);
  } else {
    console.log('TEST FAIL\n'.red);
  }
};

const checkforOwner = () => {
  console.log(`==> AS A OWNER <==\n`);
  const expectation = {
    read: true,
    write: true,
  };
  let ref = 'assignments/course1Id';
  const auth = { uid: 'ownerId' };
  const data = { title: 'Test Assignment 2' };
  const readAllowed = read(ref, auth);
  const { root, writeAllowed } = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);
  print(expectation, readAllowed, writeAllowed);
};

const checkforCoursesMember = () => {
  console.log(`==> AS A COURSE'S MEMBER, (enrolled in course) <==\n`);
  const expectation = {
    read: true,
    write: false,
  };
  let ref = 'assignments/course1Id';
  const auth = { uid: 'member1Id' };
  const data = { title: 'Test Assignment 2' };
  const readAllowed = read(ref, auth);
  const { root, writeAllowed } = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);

  print(expectation, readAllowed, writeAllowed);
};

const checkforUserWithAuth = () => {
  console.log(`==> AS A USER (AUTH != NULL) (not enrolled in course) <==\n`);
  const expectation = {
    read: true,
    write: false,
  };
  let ref = 'assignments/course1Id';
  const auth = { uid: 'randonId' };
  const data = { title: 'Test Assignment 2' };
  const readAllowed = read(ref, auth);
  const { root, writeAllowed } = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);

  print(expectation, readAllowed, writeAllowed);
};
const checkforUserWithoutAuth = () => {
  console.log(`==> AS A ANONYMOUS USER (AUTH == NULL) <==\n`);
  const expectation = {
    read: false,
    write: false,
  };
  let ref = 'assignments/course1Id';
  const auth = null;
  const data = { title: 'Test Assignment 2' };
  const readAllowed = read(ref, auth);
  const { root, writeAllowed } = write(`${ref}/assignment2Id`, data, auth);
  assert.equal(root.assignments.$value().course1Id.assignment2Id.title, data.title);

  print(expectation, readAllowed, writeAllowed);
};

const initChecks = () => {
  console.log(`\n========== Firebase Rules Test For Assignments Collection ==========\n`.yellow);
  console.log(`Rules Considerations :\n`.cyan);
  console.log(`  1. Owner can read & write.\n`.cyan);
  console.log(`  2. User(logged in) can only read.\n`.cyan);
  console.log(`  2. Anonymous User(not logged in) can not read & write.\n`.cyan);
  console.log('****** Test Start ********\n'.blue);
  checkforOwner();
  checkforCoursesMember();
  checkforUserWithAuth();
  checkforUserWithoutAuth();
  console.log('****** Test End ********\n'.blue);
  console.log(`\n====================================================================\n`.yellow);
};

module.exports = initChecks;
