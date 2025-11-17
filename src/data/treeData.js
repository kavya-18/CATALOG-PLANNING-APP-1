// src/data/treeData.js

export const treeData = {
  id: "root",
  name: "Wedding Categories",
  children: [
    {
      id: "sarees",
      name: "Sarees",
      notes: "",
      images: [],
      link: "",
      status: "Idea",
      children: [
        {
          id: "pattu-sarees",
          name: "Pattu Sarees",
          notes: "",
          images: [],
          link: "",
          status: "Idea",
          children: [
            {
              id: "gadwal",
              name: "Gadwal Sarees",
              notes: "",
              images: [],
              link: "",
              status: "Idea",
              children: []
            }
          ]
        },
        {
          id: "soft-silk",
          name: "Soft Silk",
          notes: "",
          images: [],
          link: "",
          status: "Idea",
          children: []
        }
      ]
    },

    {
      id: "jewelry",
      name: "Jewelry",
      children: []
    },

    {
      id: "decor",
      name: "Decorations",
      children: []
    }
  ]
};
