export const usersRes = {
  data: [
    {
      userId: 1,
      roleId: 1,
      name: "maddy",
      age: 25,
      description: "girl next door",
      pets: [
        {
          petId: 1,
          name: "chubs",
          breed: "pug",
          age: 4,
          description: "elegant w/ a flair of sass",
          image: "attach image link",
        },
        {
          petId: 2,
          name: "meowzus",
          breed: "singapore stray",
          age: 3,
          description: "thinks he's the boss",
          image: "attach image link",
        },
      ],
      eventId: [1],
    },
    {
      userId: 2,
      roleId: 1,
      name: "austin",
      age: 27,
      description: "guy next door",
      pets: [
        {
          petId: 3,
          name: "kopi",
          breed: "schnauzer",
          age: 13,
          description: "loves playing with dogs",
          image: "attach image link",
        },
      ],
      eventId: null,
    },
  ],
};

export const rolesRes = {
  data: [
    {
      roleId: 1,
      role: "admin",
    },
    {
      roleId: 2,
      role: "user",
    },
  ],
};

export const eventsRes = {
  data: [
    {
      eventId: 1,
      locationId: 1,
      description: "play date",
      petsAttending: 3,
      userId: [1, 2],
    },
  ],
};

export const locationRes = {
  data: [
    {
      locationId: 1,
      name: "Lola's",
      address: "48 Lor Mambong",
      region: "South",
      size: 1700,
      image:
        "https://i.pinimg.com/1200x/b8/dd/67/b8dd67caaa3eb6b987e7b69fab7364eb.jpg",
    },
    {
      locationId: 2,
      name: "Plain Meredit",
      address: "7 Holland Vlg Wy",
      region: "South",
      size: 2000,
      image:
        "https://i.pinimg.com/1200x/b8/dd/67/b8dd67caaa3eb6b987e7b69fab7364eb.jpg",
    },
    {
      locationId: 3,
      name: "asdasdas",
      address: "48 Lor Mambong",
      region: "South",
      size: 1700,
      image:
        "https://i.pinimg.com/1200x/b8/dd/67/b8dd67caaa3eb6b987e7b69fab7364eb.jpg",
    },
    {
      locationId: 4,
      name: "uhgfiuahsdfnsaf",
      address: "7 Holland Vlg Wy",
      region: "South",
      size: 2000,
      image:
        "https://i.pinimg.com/1200x/b8/dd/67/b8dd67caaa3eb6b987e7b69fab7364eb.jpg",
    },
  ],
};
