const META_LAYERS = [
    {
        name: "Data Activity",
        label: "s1",
        classes: ["s", "s-1"],
        superlayer: null,
    },
    {
        name: "Data",
        label: "s2",
        classes: ["s", "s-2"],
        superlayer: "s1",
    },
    {
        name: "Activity Form",
        label: "s3",
        classes: ["s", "s-3"],
        superlayer: "s1",
    },
    {
        name: "Legal Basis",
        label: "s4",
        classes: ["s", "s-4"],
        superlayer: "s1",
    },
    {
        name: "Data Activity Purpose",
        label: "s5",
        classes: ["s", "s-5"],
        superlayer: "s1",
    },
    {
        name: "Security Mechanism",
        label: "s6",
        classes: ["s", "s-6"],
        superlayer: "s1",
    },
    // {
    //     name: "s8 (example)",
    //     label: "s8",
    //     classes: ["s", "s-8"],
    //     superlayer: null,
    // },
]

export default META_LAYERS;