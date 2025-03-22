# Thomas
Flertallskalkulator
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stortingets Flertallsgenerator</title>
    <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        button {
            padding: 8px 16px;
            background-color: #e2e2e2;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #d0d0d0;
        }
        .parti-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 6px;
            border: 2px solid #ccc;
            cursor: pointer;
            transition: all 0.2s;
        }
        .parti-row.selected {
            background-color: #e6f4ea;
            border-color: #34a853;
        }
        .parti-row:not(.selected) {
            background-color: white;
        }
        .parti-name {
            display: flex;
            align-items: center;
        }
        .parti-name input {
            margin-right: 12px;
            width: 18px;
            height: 18px;
        }
        .parti-mandater {
            font-weight: bold;
        }
        .results {
            margin-top: 24px;
            background-color: white;
            padding: 16px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .results-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 12px;
        }
        .votes-count {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .votes-for, .votes-against {
            text-align: center;
        }
        .votes-for .count {
            font-size: 18px;
            font-weight: bold;
            color: #34a853;
        }
        .votes-against .count {
            font-size: 18px;
            font-weight: bold;
            color: #ea4335;
        }
        .progress-bar {
            width: 100%;
            background-color: #e2e2e2;
            height: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            border-radius: 8px;
        }
        .progress-fill.majority {
            background-color: #34a853;
        }
        .progress-fill.minority {
            background-color: #ea4335;
        }
        .result-message {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
        }
        .result-message.majority {
            color: #34a853;
        }
        .result-message.minority {
            color: #ea4335;
        }
        .footer {
            margin-top: 24px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script type="text/babel">
        const FlertallsGenerator = () => {
            const [partier, setPartier] = React.useState([
                { navn: 'Arbeiderpartiet', mandater: 48, stemmerFor: false },
                { navn: 'Høyre', mandater: 36, stemmerFor: false },
                { navn: 'Senterpartiet', mandater: 28, stemmerFor: false },
                { navn: 'Fremskrittspartiet', mandater: 21, stemmerFor: false },
                { navn: 'Sosialistisk Venstreparti', mandater: 13, stemmerFor: false },
                { navn: 'Rødt', mandater: 8, stemmerFor: false },
                { navn: 'Venstre', mandater: 8, stemmerFor: false },
                { navn: 'Miljøpartiet De Grønne', mandater: 3, stemmerFor: false },
                { navn: 'Kristelig Folkeparti', mandater: 3, stemmerFor: false },
                { navn: 'Pasientfokus', mandater: 1, stemmerFor: false },
            ]);
            
            const [forMandater, setForMandater] = React.useState(0);
            const [motMandater, setMotMandater] = React.useState(169);
            const [harFlertall, setHarFlertall] = React.useState(false);
            const totaltAntallMandater = 169;
            const flertallsgrense = 85;
            
            React.useEffect(() => {
                const antallFor = partier.reduce((sum, parti) => 
                    sum + (parti.stemmerFor ? parti.mandater : 0), 0);
                
                setForMandater(antallFor);
                setMotMandater(totaltAntallMandater - antallFor);
                setHarFlertall(antallFor >= flertallsgrense);
            }, [partier]);
            
            const toggleParti = (index) => {
                const nyePartier = [...partier];
                nyePartier[index].stemmerFor = !nyePartier[index].stemmerFor;
                setPartier(nyePartier);
            };
            
            const resetAll = () => {
                setPartier(partier.map(parti => ({ ...parti, stemmerFor: false })));
            };
            
            const selectAll = () => {
                setPartier(partier.map(parti => ({ ...parti, stemmerFor: true })));
            };

            return (
                <div className="container">
                    <h1>Stortingets Flertallsgenerator</h1>
                    
                    <div className="button-container">
                        <button onClick={resetAll}>Nullstill alle</button>
                        <button onClick={selectAll}>Velg alle</button>
                    </div>
                    
                    <div>
                        {partier.map((parti, index) => (
                            <div 
                                key={parti.navn} 
                                className={`parti-row ${parti.stemmerFor ? 'selected' : ''}`}
                                onClick={() => toggleParti(index)}
                            >
                                <div className="parti-name">
                                    <input 
                                        type="checkbox" 
                                        checked={parti.stemmerFor} 
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleParti(index);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span>{parti.navn}</span>
                                </div>
                                <div className="parti-mandater">
                                    {parti.mandater} {parti.mandater === 1 ? 'mandat' : 'mandater'}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="results">
                        <div className="results-title">Resultat:</div>
                        
                        <div className="votes-count">
                            <div className="votes-for">
                                <div className="count">{forMandater}</div>
                                <div>For</div>
                            </div>
                            <div className="votes-against">
                                <div className="count">{motMandater}</div>
                                <div>Mot</div>
                            </div>
                        </div>
                        
                        <div className="progress-bar">
                            <div 
                                className={`progress-fill ${harFlertall ? 'majority' : 'minority'}`}
                                style={{ width: `${(forMandater / totaltAntallMandater) * 100}%` }}
                            ></div>
                        </div>
                        
                        <div className={`result-message ${harFlertall ? 'majority' : 'minority'}`}>
                            {harFlertall 
                                ? `Flertall oppnådd! (${forMandater}/${totaltAntallMandater})` 
                                : `Mangler ${flertallsgrense - forMandater} mandater for flertall`}
                        </div>
                    </div>
                    
                    <div className="footer">
                        Flertallsgrense: 85 av 169 mandater
                    </div>
                </div>
            );
        };

        ReactDOM.render(<FlertallsGenerator />, document.getElementById('app'));
    </script>
</body>
</html>
