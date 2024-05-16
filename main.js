const express = require("express");
const app = express();
app.use(express.json());

let today = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

let members = [
  {
    id: 1,
    name: "mero",
    national_Id: 333,
    phoneNumber: "01009625110",
    memberShip: {
      from: "4/16/2024",
      to: "6/16/2024",
      cost: 400,
    },
    status: { active: true, freeze: false },
    trainer_Id: 1,
  },
  {
    id: 2,
    name: "Tarek",
    national_Id: 333,
    phoneNumber: "01009625110",
    memberShip: {
      from: "4/16/2024",
      to: "6/16/2024",
      cost: 500,
    },
    status: { active: true, freeze: false },
    trainer_Id: 1,
  },
  {
    id: 3,
    name: "mero",
    national_Id: 333,
    phoneNumber: "01009625110",
    memberShip: {
      from: "3/16/2024",
      to: "5/15/2024",
      cost: 300,
    },
    status: { active: true, freeze: false },
    trainer_Id: 2,
  },
];

let trainers = [
  {
    id: 1,
    name: "Marawan",
    duration: { from: "4/16/2024", to: "6/16/2024" },
  },
  {
    id: 2,
    name: "Ahmed",
    duration: { from: "3/16/2024", to: "5/15/2024" },
  },
];

// req.body.id = users.length + 1;
// users.push(req.body);
// res.json({ message: done, usres: users });

// Members API
app.post("/member", (req, res, next) => {
  members.push({ id: members.length + 1, ...req.body });
  res.statusCode = 201;
  res.json({ message: "done", members: members });
});

app.get("/member", (req, res, next) => {
  res.json({ message: "done", members: members });
});
app.get("/member/:id", (req, res, next) => {
  const { id } = req.params;
  const memberId = members.findIndex((member) => member.id == id);
  console.log(today);
  console.log(members[memberId].memberShip.to);
  if (today > members[memberId].memberShip.to) {
    res.json({ message: "this member is not allowed to enter the gym" });
  } else {
    res.json({ message: "done", member: members[memberId] });
  }
});

app.patch("/member/:id", (req, res, next) => {
  const { id } = req.params;
  const memberId = members.findIndex((member) => member.id == id);

  members[memberId].name = req.body.name;
  members[memberId].memberShip.from = req.body.memberShip.from;
  members[memberId].memberShip.to = req.body.memberShip.to;
  members[memberId].memberShip.const = req.body.memberShip.const;
  members[memberId].trainer_Id = req.body.trainer_Id;
  res.json({ message: "done", members: members[memberId] });
});

app.delete("/member/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(members.findIndex((member) => member.id == id));
  members.splice(
    members.findIndex((member) => member.id == id),
    1
  );
  res.json({ message: "done", members });
});

// Trainer API
app.post("/trainer", (req, res, next) => {
  trainers.push({ id: trainers.length + 1, ...req.body });
  res.statusCode = 201;
  res.json({ message: "done", trainers: trainers });
});

app.get("/trainer", (req, res, next) => {
  res.json({ message: "done", trainers: trainers });
});

app.patch("/trainer/:id", (req, res, next) => {
  const { id } = req.params;
  const memberId = trainers.findIndex((member) => member.id == id);

  trainers[memberId].name = req.body.name;
  trainers[memberId].duration.to = req.body.duration.to;
  trainers[memberId].duration.from = req.body.duration.from;
  res.json({ message: "done", trainer: trainers[memberId] });
});

app.delete("/trainer/:id", (req, res, next) => {
  const { id } = req.params;
  trainers.splice(
    trainers.findIndex((member) => member.id == id),
    1
  );
  res.json({ message: "done", trainers: trainers });
});

app.get("/trainer/:id", (req, res, next) => {
  const { id } = req.params;
  const trainerId = trainers.findIndex((trainer) => trainer.id == id);

  const member = members.filter((member) => member.trainer_Id == id);
  trainers[trainerId].members = member;

  res.json({ message: "done", trainer: trainers[trainerId] });
});

// Statistics API
app.get("/revenues/members", (req, res, next) => {
  const revenues = members.reduce(
    (accumulator, currentValue) => accumulator + currentValue.memberShip.cost,
    0
  );

  res.json({ message: "done", revenues: revenues });
});

//! before use this API, please use a  ( get specific trainer )
app.get("/revenues/trainer/:id", (req, res, next) => {
  const { id } = req.params;
  const trainerId = trainers.findIndex((trainer) => trainer.id == id);

  if (trainers[trainerId].members != null) {
    const revenues = trainers[trainerId].members.reduce(
      (accumulator, currentValue) => accumulator + currentValue.memberShip.cost,
      0
    );
    res.json({ message: "done", revenues: revenues });
  } else {
    res.json({
      message: "before use this API, please use a  ( get specific trainer )",
    });
  }
});

app.listen(3000, () => {
  console.log("server running");
});
