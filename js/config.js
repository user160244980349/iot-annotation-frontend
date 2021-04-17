const META_LAYERS = [
    {
        name: "First-party collection (example)",
        label: "s1",
        classes: ["s", "s-1"],
        superlayer: null,
    },
    {
        name: "Data subject (example)",
        label: "s2",
        classes: ["s", "s-2"],
        superlayer: "s1",
    },
    {
        name: "Third-party collection (example)",
        label: "s3",
        classes: ["s", "s-3"],
        superlayer: null,
    },
    {
        name: "Data subject (example)",
        label: "s4",
        classes: ["s", "s-4"],
        superlayer: "s3",
    },
    {
        name: "s5 (example)",
        label: "s5",
        classes: ["s", "s-5"],
        superlayer: null,
    },
    {
        name: "s6 (example)",
        label: "s6",
        classes: ["s", "s-6"],
        superlayer: null,
    },
    {
        name: "s7 (example)",
        label: "s7",
        classes: ["s", "s-7"],
        superlayer: null,
    },
    {
        name: "s8 (example)",
        label: "s8",
        classes: ["s", "s-8"],
        superlayer: null,
    },
]

export default META_LAYERS;