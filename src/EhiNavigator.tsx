

import React, { useRef, useState, useContext, createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import SplitPane from 'react-split-pane';
import { store, storeIndex, db } from './client';
import _ from "lodash"
import { getTableList, llm, llms } from './agent';
import { expandTableSet, processTables, processTablesToString } from './sampleRows';
import AIChat from './AiChatWidget';
import {AIChat as  Chat2 } from './chat/chat'
import { getCodeBlocks, runCode} from './util';
import { analyzePrompt } from './prompts';

window.db = db;
window._ = _;

const StoreContext = createContext<typeof store | undefined>(undefined);

// Define the action types
type Action =
  | { type: 'SET_SELECTED_TABLES'; payload: string[] }
  | { type: 'SET_STATE_FROM_URL'; payload: State }
  | { type: 'FOLLOW_CHILD_TABLE_LINK'; payload: { parentTableName: string; rowId: string; childTableName: string } }
  | { type: 'FOLLOW_REFERENCE'; payload: { tableName: string; rowId: string } };

// Define the initial state
interface State {
  selectedTables: string[];
  highlightedRows: {
    [tableName: string]: string[];
  };
}

const initialState: State = {
  selectedTables: [],
  highlightedRows: {},
};

function reducer(state: State, action: Action): State {
  console.log("State", JSON.stringify(state, null, 2), "Action", JSON.stringify(action, null, 2))
  switch (action.type) {
    case 'SET_SELECTED_TABLES':
      return { ...state, selectedTables: action.payload, highlightedRows: {} };
    case 'SET_STATE_FROM_URL':
      return action.payload;
    case 'FOLLOW_CHILD_TABLE_LINK':
      const { parentTableName, rowId, childTableName } = action.payload;
      const childTableMappings = store.$meta.schemas[parentTableName].discoveredMappings?.filter(
        (m) => m.type === 'has-child-table' && m.source === parentTableName && m.target === childTableName
      );

      if (childTableMappings && childTableMappings.length > 0) {
        const joinKeys = childTableMappings[0].joinKeys;
        const parentRow = store[parentTableName].find(
          (row) => row[store.$meta.schemas[parentTableName].primaryKey[0].columnName] === rowId
        );

        const matchCondition = joinKeys.map(({ source, target }) => ({
          childColumn: target,
          parentColumn: source,
          parentValue: parentRow[source],
        }));

        return {
          ...state,
          selectedTables: Array.from(new Set(state.selectedTables.concat([childTableName]))).sort(),
          highlightedRows: {
            [childTableName]: store[childTableName]
              .filter((childRow) =>
                matchCondition.every(({ childColumn, parentValue }) => childRow[childColumn] === parentValue)
              )
              .map((childRow) => childRow[store.$meta.schemas[childTableName].primaryKey[0].columnName]),
          },
        };
      }
      return state;
    case 'FOLLOW_REFERENCE':
      const { tableName: refTableName, rowId: refRowId } = action.payload;
      return {
        ...state,
        selectedTables: Array.from(new Set(state.selectedTables.concat([refTableName]))).sort(),
        highlightedRows: {
          [refTableName]: [refRowId],
        },
      };
    default:
      return state;
  }
}

// Define the schema and data types
interface Column {
  ordinalPosition: number;
  name: string;
  type: string;
  discontinued: boolean;
  description: string;
  entries?: string[];
}

interface PrimaryKey {
  columnName: string;
  ordinalPosition: number;
}

interface DiscoveredMapping {
  type: string;
  source: string;
  target: string;
  joinKeys: {
    source: string;
    target: string;
  }[];
}

interface DiscoveredForeignKey {
  source: string;
  target: string;
  joinKey: {
    source: string;
    target: string;
  };
}

interface Schema {
  [tableName: string]: {
    name: string;
    description: string;
    primaryKey: PrimaryKey[];
    columns: Column[];
    discoveredMappings?: DiscoveredMapping[];
    discoveredForeignKeys?: DiscoveredForeignKey[];
  };
}

const DataSelection: React.FC<{
  selectedTables: string[];
  onTableSelectionChange: (selectedTables: string[]) => void;
}> = ({ selectedTables, onTableSelectionChange }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleTableSelection = (tableName: string) => {
    if (selectedTables.includes(tableName)) {
      onTableSelectionChange(selectedTables.filter((name) => name !== tableName));
    } else {
      onTableSelectionChange([...selectedTables, tableName]);
    }
  };

  function all() {
    onTableSelectionChange(Object.keys(store.$meta.schemas));
  }

  function none() {
    onTableSelectionChange([]);
  }

  async function ai() {
    const q = window.prompt("What is your question?");
    console.log("For q", q)
    const tables = await getTableList(q, llm);
    console.log("AI recommends", tables)
    const expandedTables = expandTableSet(store, tables.filter(t => !!store.$meta.schemas[t]));
    console.log("Expanded to", expandedTables)
    onTableSelectionChange(expandedTables);
  }

  async function ts() {
    const promptText = await processTablesToString(selectedTables, store, {sampleSize: 2, includeAllForeignKeys: true});
    await navigator.clipboard.writeText(promptText);
    console.log("Wrote", promptText)
  }

  return (
    <div 
    // style={{ flexShrink: 0, width: expanded ? '750px' : '3in', marginRight: '.5em', maxHeight: '100vh', overflowY: 'scroll' }}
    
    >
      <h3>Data Tables</h3>
      <button onClick={toggleExpand}>{expanded ? '🪗' : '🪗'}</button>
      <button onClick={all}>∀</button>
      <button onClick={none}>∅</button>
      <button onClick={ai}>🪄</button>
      <button onClick={ts}>ts</button>
      <ul style={{ margin: '0px', padding: '0px' }}>
        {Object.keys(store.$meta.schemas)
          .sort()
          .map((tableName) => (
            <li
              style={{
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: expanded ? '750px' : '3in',
                display: 'block',
                marginBottom: '1px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: selectedTables.includes(tableName) ? '#f0f0f0' : 'transparent',
                transition: 'background-color 0.3s',
              }}
              key={tableName}
              onClick={() => toggleTableSelection(tableName)}
            >
              <input
                type="checkbox"
                checked={selectedTables.includes(tableName)}
                readOnly
              />
              {tableName} {expanded ? store.$meta.schemas[tableName].description : ''}
            </li>
          ))}
      </ul>
    </div>
  );
};

interface TableProps {
  visible: boolean,
  tableName: string;
  tableData: any[];
  tableSchema: Schema[string];
  highlightedRows: string[] | null;
  handleForeignKeyClick: (parentTableName: string,  rowId: string, foreignKeys: {target: string, joinKey: {target: string}}[], value: any) => void;
  handleChildTableClick: (parentTableName: string, rowId: string, childTableName: string) => void;
}

const Table: React.FC<TableProps> = ({
  visible,
  tableName,
  tableData,
  tableSchema,
  highlightedRows,
  handleForeignKeyClick,
  handleChildTableClick,
}) => {
  // console.log("Render table", tableName);

  if (!tableData || !tableSchema) return null;
  const childMaps = tableSchema.discoveredMappings?.filter((m) => m.type === 'has-child-table' && m.source === tableName) || [];
  const childMapsKey = JSON.stringify(childMaps)
  const childCounts = useMemo(() => {
    return tableData.map(parentRow => childMaps.map((m) => 
      store[m.target]?.filter((childRow) => m.joinKeys.every(({source, target}) => childRow[target] ===  parentRow[source])).length || 0
    ))
  }, [childMapsKey]);

const header: any[] = tableSchema.columns.map((column, i) => (
              <th key={column.name} className={`${i < tableSchema.primaryKey.length ? "pk" : ""}`}>{column.name}</th>
            ));

if (childMaps.length) {
  header.splice(tableSchema.primaryKey.length, 0, <th key="childmaps">Children</th>);
}

const foreignKeys =  useMemo(() => Object.fromEntries(tableSchema.columns.map((column) => ([column.name, (tableSchema.discoveredForeignKeys ?? []).filter(
        (fk) => fk.joinKey.source === column.name
      ).concat(
      (tableSchema.discoveredMappings || [])
      .filter(
          (m) => m.type === 'has-parent-table' && m.joinKeys.length === 1 && m.joinKeys[0].source === column.name
        )
        .map((f) => ({
          source: f.source,
          target: f.target,
          joinKey: { source: f.joinKeys[0].source, target: f.joinKeys[0].target },
        })))
  ]))), []);


function bodyRow(row: Record<string,any>, index: number){
  const ret = tableSchema.columns.map((column: Column) => {
    const value = row[column.name];
    const colForeignKeys = foreignKeys[column.name]
    return (
      <td key={column.name}>
        {colForeignKeys.length ? (
          <a
            href="#"
            onClick={(e) => {
              handleForeignKeyClick(tableName, row[tableSchema.primaryKey[0].columnName], colForeignKeys, value);
              e.preventDefault();
            }}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    );
  })

  if (childMaps.length) {
    ret.splice(tableSchema.primaryKey.length, 0, (<td key={"children"}>
      <select
        disabled={childCounts[index].every(c => c === 0)}
        onChange={(e) => {
          const childTableName = e.target.value;
          if (childTableName) {
            handleChildTableClick(tableName, row[tableSchema.primaryKey[0].columnName], childTableName);
          }
        }}
      >
        <option value="">{_.sum(childCounts[index])} Children</option>
        {childMaps.map((m, mi) => (
            <option key={m.target} value={m.target}>
              {m.target} ({childCounts[index][mi]})
            </option>
          )).filter((_, i) => childCounts[index][i] > 0)}
      </select>
      </td>)
      );
    }
    return ret;
  }

// (childMaps.length ? [] : []).concat(

  return (
    <div className={`table-container ${visible ? "" : "hidden"}`} key={tableName} >
      <h3>{tableName} <a target='_blank' href={`https://open.epic.com/EHITables/GetTable/${tableName}.htm`}>📄</a> </h3>
      <div className={`table-container-inner`}>
      <table style={{ borderWidth: '1px' }}>
        <thead style={{position: 'sticky'}}>
          <tr>
            {header}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={highlightedRows?.includes(row[tableSchema.primaryKey[0].columnName]) ? 'highlighted' : ''}
            >
                {}
              {bodyRow(row, index)}
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

const TableMemo = React.memo(Table)

const DataViewer: React.FC<{
  onEstablishNavPoint: (tableName: string, rowId: string) => void;
  selectedTables: string[];
  highlightedRows: { [tableName: string]: string[] };
}> = ({ selectedTables, highlightedRows, onEstablishNavPoint }) => {
  const store = useContext(StoreContext);
  const dispatch = useContext(DispatchContext)!;
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlightedRow = tableRef.current?.querySelector('.highlighted') as HTMLElement;
    highlightedRow?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [highlightedRows]);

  const allTables = useMemo(() => Object.keys(store.$meta.schemas).sort(), []);

  const handleForeignKeyClick = useMemo(() => {

    return function(parentTableName: string,  parentRowId: string, foreignKeys: {target: string, joinKey: {target: string}}[], rowId: string){
      onEstablishNavPoint(parentTableName, parentRowId);
      const firstForeignKey = foreignKeys.find(fk => {
        const childTable = fk.target;
        const childTableColumn = fk.joinKey.target;
        const data = store[childTable].find(row => row[childTableColumn] === rowId);
        return data
      })
      if (firstForeignKey) {
        dispatch({ type: 'FOLLOW_REFERENCE', payload: { tableName: firstForeignKey.target, rowId } });
      }
}}, []);

  const handleChildTableClick = useMemo(() => (parentTableName: string, rowId: string, childTableName: string) => {
    onEstablishNavPoint(parentTableName, rowId);
    dispatch({ type: 'FOLLOW_CHILD_TABLE_LINK', payload: { parentTableName, rowId, childTableName } });
  }, []);

  return (
    <div ref={tableRef} style={{maxHeight: '100%', overflowY: 'scroll'}}>
      {allTables.map((tableName) => (
        <TableMemo
          visible={selectedTables.includes(tableName)}
          key={tableName}
          tableName={tableName}
          tableData={store?.[tableName]}
          tableSchema={store?.$meta.schemas[tableName]}
          highlightedRows={highlightedRows[tableName] || null}
          handleForeignKeyClick={handleForeignKeyClick}
          handleChildTableClick={handleChildTableClick}
        />
      ))}
    </div>
  );
};

const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

const EhiNavigator: React.FC = () => {
  let passedState =  initialState;
  try {
    console.log(window.location.hash.slice(1)) 
    passedState = JSON.parse(decodeURIComponent(window.location.hash.slice(1)))
  } catch { }
  const [state, dispatch] = useReducer(reducer, passedState);
  // const location = useLocation();

  useEffect(() => {
    function onHashChange(e) {
      console.log("on hahs change", e);
      console.log("Parsing url", new URL(e.newURL).hash.slice(1));
      const stateFromUrl = JSON.parse(decodeURIComponent(new URL(e.newURL).hash.slice(1)) || "{}");
      if (stateFromUrl && Object.keys(stateFromUrl).length > 0) {
          console.log("New state from url", stateFromUrl, state);
          dispatch({ type: 'SET_STATE_FROM_URL', payload: stateFromUrl });

      } 
    }
  window.addEventListener('hashchange', onHashChange)
  console.log("Assed dhase listenr")
  return () => {
    window.removeEventListener('hashchange', onHashChange);
  }
  }, []);

  useEffect(() => {
    const newUrl = `#${JSON.stringify(state)}`;
    console.log("maybe state", newUrl)
    const stateFromUrl = JSON.parse(decodeURIComponent(window.location.hash.slice(1)) || "{}");
    if (JSON.stringify(stateFromUrl) !== JSON.stringify(state)) {
      console.log("Indeed push", stateFromUrl, state)
      window.history.pushState(state, '', "?#" + JSON.stringify(state));
    }
  }, [state]);

  const handleTableSelectionChange = (selectedTables: string[]) => {
    console.log("New selection", selectedTables)
    dispatch({ type: 'SET_SELECTED_TABLES', payload: selectedTables });
  };

  const onEstablishNavPoint = useCallback((tableName: string, rowId: string) => {
    const navState = reducer(state, { type: 'FOLLOW_REFERENCE', payload: {tableName, rowId}});
    console.log("Nav point state", navState, tableName, rowId)
    window.history.pushState(navState, '', "?#" + JSON.stringify(navState))
  }, []);

  const systemPrompt = () => ({
    label: `TS Interfaces for: ${state.selectedTables.join(", ")}`, // (expanded to add: ${expandTableSet(store, state.selectedTables).join(", ")})`,
    content: `You are a helpful informatics assistant, aware of the following EHI Schema: \n` +  processTablesToString(state.selectedTables, store, {sampleSize: 2, includeAllForeignKeys: true, expandTables: false})
  });
 
  const expandedTables = expandTableSet(store, state.selectedTables.filter(t => !!store.$meta.schemas[t]));
  console.log("ET", expandedTables)
  const [useAi, setUseAi] = useState(false);
  return (
    <StoreContext.Provider value={store}>
      <DispatchContext.Provider value={dispatch}>
        <div style={{ display: 'flex', height: '100vh' , overflow: 'hidden', width: '100vw'}}>
          {/* <button onClick={() => setUseAi(!useAi)} style={{zIndex: 10, right: '1em', top: '1em', position: 'absolute'}}>ai</button> */}


        <SplitPane split="vertical" defaultSize={'3in'} minSize={100}>
          <DataSelection
            selectedTables={state.selectedTables}
            onTableSelectionChange={handleTableSelectionChange} />
          <SplitPane split="vertical" defaultSize={'100%'}  minSize={100}>
            <DataViewer
              onEstablishNavPoint={onEstablishNavPoint}
              selectedTables={state.selectedTables}
              highlightedRows={state.highlightedRows}
            />
          <Chat2
          llm={llm}
          llms={llms}
          defaultInputText={analyzePrompt}
          systemPromptGenerator={ systemPrompt }
          autoRespondSuggester={async (q) => {
            let blocks = getCodeBlocks(q.content || "", "js", "javascript");
            if (blocks.length) {
              const result = runCode(db, blocks[0])
              let resultString = `${result.errors.size ? `#### Error\n\n${Array.from(result.errors).join("\n\n")}` : ''}\n${result.logs.length ? `#### Console output:\n\n${result.logs.join("\n\n")}` : ''}`.trim()
              if (resultString) {
                return {label: `${result.errors.size} errors, ${result.logs.length} log lines`, content:  "I ran your code block in a clean session.\n" + resultString}
              } else  {
                return {label: `No output`, content: `I tried to run your code but saw no output or errors. Please create a single \`\`\`js code block that performs the analysis so I can run it directly and show you the results.`}
              }
            }
          }}
          />


          </SplitPane>
        </SplitPane>

          {/* <DataSelection
            selectedTables={state.selectedTables}
            onTableSelectionChange={handleTableSelectionChange}
          />
          
          <div style={{ flex: 1, width: '20%', overflowY: 'hidden', overflowX: 'hidden' }}>
          </div>
          <div style={{flexBasis: '800px', maxWidth: useAi ? '800px' : '0px', flexGrow: 0, flexShrink: 0}}>
        </div> */}
        </div>
        
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
};

export default EhiNavigator;