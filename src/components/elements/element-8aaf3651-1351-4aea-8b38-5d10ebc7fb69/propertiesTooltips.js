export default {
    labels: `The labels must be defined in an array like this: \n\n
\`\`\`js
['Tatooine', 'Coruscant', 'Kashyyyk', 'Dagobah', 'Bespin', 'Endor', 'Hoth'];
\`\`\``,
    datasets: `The datasets are represented as objects in an array: \n\n
\`\`\`json
[
    {
        label: 'Millenium Falcon',
        backgroundColor: 'rgb(255, 99, 132)',
        data: [100.0, 5.0, 2.0, 20.0, 30.0, 10.0, 45.0],
    },
    {
        label: 'TIE Fighter',
        backgroundColor: '#F7AB49',
        data: [26, 42, 35, 48, 52, 24, 75],
    },
];
\`\`\``,
};
