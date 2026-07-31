export const elementDefinitions = [
  { key:'tierra', name:'Tierra', glyph:'◇', color:'#B89056', visual:'/assets/sod-visual/048.png', placeholder:false, description:'Materia, cuerpo, límite, estructura y arraigo.' },
  { key:'agua', name:'Agua', glyph:'≈', color:'#2EA9E8', visual:'/assets/sod-visual/049.png', placeholder:false, description:'Emoción, memoria, adaptación, vínculo y profundidad.' },
  { key:'viento', name:'Viento', glyph:'≋', color:'#A9E7E4', visual:'/assets/sod-visual/050.png', placeholder:false, description:'Pensamiento, palabra, perspectiva, movimiento y posibilidad.' },
  { key:'fuego', name:'Fuego', glyph:'△', color:'#FF735A', visual:'/assets/sod-visual/022.png', placeholder:true, description:'Voluntad, transformación, deseo, coraje y dirección.' },
  { key:'eter', name:'Éter', glyph:'Ø', color:'#9A70FF', visual:'/assets/sod-visual/023.png', placeholder:true, description:'Conciencia, información, unidad, vacío y origen.' }
];

export const levelDefinitions = [
  { key:'velo', label:'Velo', quantity:12, meaning:'Lo literal, visible, simple y pragmático' },
  { key:'remez', label:'Remez · Eco', quantity:12, meaning:'Insinuación, metáfora y patrones ocultos' },
  { key:'derash', label:'Derash · Patrón', quantity:6, meaning:'Relato, historia, moraleja y narrativa cultural' },
  { key:'sod', label:'SØD · Puerta', quantity:2, meaning:'Revelación mística y arquetípica' },
  { key:'sod2', label:'SØD² · Origen', quantity:1, meaning:'Núcleo primordial y revelación absoluta' }
];

const universeSpecs = [
  {slug:'sod',title:'Hablar con SØD',shortDescription:'Ordená lo que ocupa tu mente y convertí confusión en una comprensión posible.',humanNeed:'Necesito comprender qué pienso, qué siento o qué debería hacer.',entryQuestion:'¿Qué está ocupando tu mente en este momento?',icon:'Ø',color:'#79E8FF',message:'No vine a decidir por vos. Vine a ayudarte a observar mejor.',visual:'/assets/sod-visual/035.png',destination:'/universos/sod',type:'transformational'},
  {slug:'seeds',title:'Semillas',shortDescription:'Descubrí y cultivá comprensiones canónicas capaces de transformar tu manera de pensar.',humanNeed:'Necesito recordar e integrar aquello que comprendí.',entryQuestion:'¿Qué comprensión necesitás volver a cultivar hoy?',icon:'✦',color:'#69E9A5',message:'Las Semillas ya existen. Tu recorrido determina cuándo estás preparado para descubrirlas.',visual:'/assets/sod-visual/036.png',destination:'/semillas',type:'cultivation'},
  {slug:'habits',title:'Hábitos',shortDescription:'Construí acciones repetibles que sostengan la vida que querés crear.',humanNeed:'Necesito sostener aquello que sé que me hace bien.',entryQuestion:'¿Qué pequeño paso querés repetir hoy?',icon:'↻',color:'#8BE07D',message:'La disciplina no es castigo. Es una estructura que protege lo que elegiste.',visual:'/assets/sod-visual/059.png',destination:'/universos/habits',type:'cultivation'},
  {slug:'library',title:'Biblioteca',shortDescription:'Encontrá conocimiento transformador sin perderte en el exceso de información.',humanNeed:'Necesito comprender algo con profundidad y contexto.',entryQuestion:'¿Qué necesitás comprender hoy?',icon:'⌑',color:'#D9A95B',message:'La información se vuelve sabiduría cuando modifica una forma de observar.',visual:'/assets/sod-visual/039.png',destination:'/biblioteca',type:'knowledge'},
  {slug:'dreams',title:'Mapa de Sueños',shortDescription:'Convertí tu visión personal en un horizonte visible y evolutivo.',humanNeed:'Necesito recordar hacia dónde quiero ir y por qué.',entryQuestion:'¿Qué querés construir realmente?',icon:'✧',color:'#80B7FF',message:'Un sueño deja de ser niebla cuando empieza a ordenar decisiones.',visual:'/assets/sod-visual/052.png',destination:'/universos/dreams',type:'orientation'},
  {slug:'elements33',title:'Elementos 33',shortDescription:'Explorá los principios universales que estructuran el desarrollo humano.',humanNeed:'Necesito un mapa para comprender mi proceso de evolución.',entryQuestion:'¿Qué aspecto de tu conciencia querés desarrollar?',icon:'◈',color:'#A77BFF',message:'No coleccionás piezas. Descubrís principios que cambian la lectura de tu propia historia.',visual:'/assets/sod-visual/037.png',destination:'/elementos',type:'philosophical-core'},
  {slug:'identity',title:'Identidad',shortDescription:'Reconocé quién sos hoy y elegí cómo querés ser acompañado.',humanNeed:'Necesito actualizar la historia que cuento sobre mí.',entryQuestion:'¿Quién sos hoy?',icon:'◐',color:'#D8EDFF',message:'Una identidad útil puede evolucionar sin negar lo que alguna vez necesitó ser.',visual:'/assets/sod-visual/055.png',destination:'/perfil',type:'orientation'},
  {slug:'observatory',title:'Observatorio',shortDescription:'Contemplá las relaciones entre tus decisiones, Semillas, Códigos, hábitos y caminos.',humanNeed:'Necesito reconocer en quién me estoy convirtiendo.',entryQuestion:'¿En quién me estoy convirtiendo?',icon:'✺',color:'#7EF0D6',message:'No muestra cuánto hiciste. Muestra qué historia cuenta todo lo que viviste.',visual:'/assets/sod-visual/038.png',destination:'/observatorio',type:'meta-universe'},
  {slug:'forge',title:'La Forja',shortDescription:'Descubrí recursos cuidadosamente seleccionados para dar un próximo paso.',humanNeed:'Necesito una herramienta confiable para continuar.',entryQuestion:'¿Qué necesitás para dar el próximo paso?',icon:'◇',color:'#E1B76E',message:'Los recursos son medios. La transformación sigue perteneciendo al usuario.',visual:'/assets/sod-visual/046.png',destination:'/marketplace',type:'resource-layer'}
];

export const universes = universeSpecs.map((u,index)=>({
  id:`universe-${index+1}`,...u,
  longDescription:`${u.shortDescription} Este universo responde a una necesidad humana concreta y conserva el control, el contexto y la autonomía del usuario.`,
  levelRequired:0,status:'active',
  practices:[
    {title:'Observar',duration:'3 min',instruction:'Nombrá qué está ocurriendo sin cerrar todavía una explicación.'},
    {title:'Distinguir',duration:'5 min',instruction:'Separá hechos, interpretaciones, emociones, valores e incertidumbres.'},
    {title:'Integrar',duration:'7 min',instruction:'Elegí una acción o una observación que permita verificar si algo cambió.'}
  ],
  messages:[u.message,'La claridad no es tener todas las respuestas. Es reducir suficiente ruido para poder actuar.','La unidad mínima de valor no es la conversación. Es la transformación.']
}));

const seedSpecs = [
  ['La atención alimenta aquello que sostiene','No todo lo que aparece merece convertirse en centro.','Elegí hoy una sola prioridad y protegela durante 25 minutos.',['atención','enfoque']],
  ['Nombrar reduce el poder de lo difuso','Una emoción sin nombre ocupa más espacio que una emoción reconocida.','Escribí: “Ahora mismo siento… porque interpreto que…”.',['claridad','emoción']],
  ['El límite también es información','Decir que no revela qué sí estás intentando preservar.','Definí una frontera concreta para las próximas 24 horas.',['límite','dirección']],
  ['La repetición construye identidad','No sos lo que intentás una vez; sos lo que practicás de forma suficiente.','Reducí un hábito a una versión de dos minutos.',['hábito','identidad']],
  ['La realidad percibida no es la realidad completa','Tu mapa puede ser útil sin ser el territorio.','Buscá una interpretación alternativa que también explique los hechos.',['perspectiva','realidad']],
  ['Toda decisión distribuye energía','Elegir algo también es dejar de alimentar otra cosa.','Anotá qué costo aceptás al elegir tu prioridad.',['decisión','energía']],
  ['El silencio no está vacío','Cuando cesa el ruido, aparecen señales antes tapadas por velocidad.','Tomá tres minutos sin estímulos y registrá qué insiste.',['silencio','señal']],
  ['El cuerpo informa antes que el relato','La tensión puede aparecer antes de que la mente admita un conflicto.','Localizá una tensión y preguntá qué decisión está evitando.',['cuerpo','información']],
  ['La claridad sin acción se convierte en decoración','Comprender y no aplicar conserva la estructura anterior.','Convertí una idea en una acción verificable de menos de diez minutos.',['integración','acción']],
  ['La pregunta organiza la búsqueda','Una pregunta pobre puede producir respuestas técnicamente correctas e inútiles.','Reescribí tu problema comenzando por “¿Qué tendría que ser verdad para…?”.',['pregunta','búsqueda']],
  ['La fricción revela diseño','Cuando algo se repite como problema, quizá no falta voluntad sino arquitectura.','Modificá el entorno antes de exigirte más disciplina.',['sistema','fricción']],
  ['La identidad puede actualizarse','Una definición antigua de vos mismo no tiene autoridad automática sobre el presente.','Identificá una frase “yo soy así” y sometela a evidencia actual.',['identidad','cambio']],
  ['Lo urgente ocupa; lo importante orienta','La urgencia trae movimiento, pero no necesariamente dirección.','Reservá un bloque primero para lo importante y después atendé lo urgente.',['prioridad','tiempo']],
  ['La integración necesita descanso','El sistema también procesa cuando deja de producir.','Cerrá una entrada de información una hora antes de dormir.',['descanso','integración']],
  ['El propósito se prueba en lo pequeño','Una gran declaración no compensa decisiones cotidianas contradictorias.','Elegí un gesto mínimo coherente con aquello que decís valorar.',['propósito','coherencia']],
  ['La incertidumbre no impide decidir','No necesitás certeza absoluta; necesitás un próximo paso reversible.','Definí la decisión más pequeña que te dé información nueva.',['incertidumbre','experimento']],
  ['La comunidad amplifica patrones','Las relaciones pueden confirmar, desafiar o transformar una identidad.','Pedí a alguien de confianza una observación concreta, no una opinión general.',['comunidad','feedback']],
  ['Ø no es ausencia: es posibilidad','El vacío previo a una forma contiene más opciones que la forma ya fijada.','Antes de responder, dejá un espacio de tres respiraciones.',['origen','posibilidad']]
];

export const seeds = seedSpecs.map((s,i)=>({id:`seed-${i+1}`,number:i+1,title:s[0],interpretation:s[1],application:s[2],keywords:s[3],glyph:i%5===0?'Ø':elementDefinitions[i%5].glyph,element:elementDefinitions[i%5].key,image:['/assets/sod-visual/056.png','/assets/sod-visual/057.png','/assets/sod-visual/027.png','/assets/sod-visual/041.png'][i%4],state:i<4?'discovered':'latent'}));

export const libraryItems = [
  {id:'lib-1',type:'Marco',title:'Todo es información',description:'Marco inicial para distinguir datos, interpretación y sentido.',duration:'8 min',seedId:'seed-5'},
  {id:'lib-2',type:'Práctica',title:'La pausa entre estímulo y respuesta',description:'Un protocolo breve para recuperar capacidad de elección.',duration:'6 min',seedId:'seed-18'},
  {id:'lib-3',type:'Mapa',title:'Hecho · Interpretación · Acción',description:'Herramienta para ordenar decisiones bajo presión.',duration:'10 min',seedId:'seed-2'},
  {id:'lib-4',type:'Ensayo',title:'La realidad es fractal',description:'Patrones que reaparecen en escalas personales y colectivas.',duration:'14 min',seedId:'seed-11'},
  {id:'lib-5',type:'Audio',title:'Volver al cuerpo',description:'Recorrido guiado para detectar información somática.',duration:'9 min',seedId:'seed-8'},
  {id:'lib-6',type:'Diagrama',title:'Arquitectura de atención',description:'Cómo el entorno compite por la energía disponible.',duration:'12 min',seedId:'seed-1'},
  {id:'lib-7',type:'Práctica',title:'Diseñar una versión mínima',description:'Transformar intención en comportamiento ejecutable.',duration:'7 min',seedId:'seed-4'},
  {id:'lib-8',type:'Principio',title:'Ø: puerta y origen',description:'Vacío, interrupción y posibilidad antes de la forma.',duration:'11 min',seedId:'seed-18'}
];


export const sampleCodes = [
  {id:'SOD-000001',title:'El momento en que distinguiste el hecho del miedo',type:'Comprensión',depth:'Fundacional',date:'Hoy',summary:'Una confusión dejó de ser una masa única y se convirtió en partes observables.',visual:'/assets/sod-visual/042.png',linkedSeedIds:['seed-2']},
  {id:'SOD-000002',title:'La decisión que abrió un camino',type:'Decisión',depth:'Raro',date:'Hace 3 días',summary:'Elegiste una acción reversible en lugar de esperar una certeza imposible.',visual:'/assets/sod-visual/044.png',linkedSeedIds:['seed-16']},
  {id:'SOD-000003',title:'Siete días sosteniendo una intención',type:'Hábito',depth:'Infrecuente',date:'Hace 2 semanas',summary:'La repetición dejó evidencia de una identidad que comenzaba a actualizarse.',visual:'/assets/sod-visual/043.png',linkedSeedIds:['seed-4']}
];

export const journeyDays = Array.from({length:14},(_,i)=>({
  day:i+1,
  title:['Observar','Nombrar','Separar','Respirar','Elegir','Limitar','Repetir','Revisar','Soltar','Escuchar','Reordenar','Actuar','Integrar','Originar'][i],
  question:[
    '¿Qué está ocurriendo sin agregar todavía una explicación?',
    '¿Qué emoción o tensión necesita un nombre preciso?',
    '¿Qué es hecho y qué es interpretación?',
    '¿Qué cambia cuando no respondés inmediatamente?',
    '¿Cuál es la decisión que más información produciría?',
    '¿Qué necesitás dejar afuera para proteger lo esencial?',
    '¿Qué versión mínima podrías sostener?',
    '¿Qué patrón apareció más de una vez?',
    '¿Qué definición ya no describe tu presente?',
    '¿Qué señal está quedando debajo del ruido?',
    '¿Qué parte del entorno está diseñando tu conducta?',
    '¿Qué comprensión puede convertirse hoy en una acción?',
    '¿Qué aprendiste sobre tu manera de decidir?',
    '¿Qué querés crear desde este nuevo punto de observación?'
  ][i],
  practice:['Registro sin juicio','Mapa emocional','Tres columnas','Tres respiraciones','Paso reversible','Frontera de 24 h','Hábito de 2 min','Revisión de patrones','Desidentificación','Silencio activo','Diseño de entorno','Acción de 10 min','Síntesis escrita','Declaración de origen'][i]
}));

export function createElementPieces(){
  const result=[];
  for(const element of elementDefinitions){
    let number=1;
    for(const level of levelDefinitions){
      for(let i=0;i<level.quantity;i++){
        result.push({
          id:`${element.key}-${number}`,number,element:element.key,elementName:element.name,level:level.key,levelLabel:level.label,
          title:`${element.name} ${String(number).padStart(2,'0')}`,
          phrase:`${level.meaning}: una lectura de ${element.name.toLowerCase()} en movimiento.`,
          interpretation:`Esta pieza trabaja ${element.description.toLowerCase()} desde el nivel ${level.label}. Su función es abrir una lectura, no cerrar una doctrina.`,
          practicalApplication:`Observá durante el día dónde aparece el patrón ${number}. Registrá una situación, una interpretación y una acción posible.`,
          concept:`Pieza ${element.glyph}${String(number).padStart(2,'0')}`,
          shortDescription:`Pieza ${number} de 33 · ${level.label}`,
          palette:[element.color,'#030711','#F3F7FB'],symbol:element.glyph,geometricMotif:['círculo','espiral','retícula','eje','fractura'][number%5],
          keywords:[element.key,level.key,'información','integración'],edition:'Genesis',rarity:level.key==='sod2'?'Origen':level.key==='sod'?'Puerta':level.key==='derash'?'Patrón':'Base',supply:null,status:'available'
        });
        number++;
      }
    }
  }
  return result;
}

export const elementPieces=createElementPieces();
export const dailyFallback={message:'No necesitás comprenderlo todo hoy. Necesitás percibir con honestidad qué información ya está pidiendo una decisión.',key:'OBSERVAR → NOMBRAR → INTEGRAR'};
