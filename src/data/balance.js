export const VERSION = '0.1.0';
export const ATTRIBUTES = ['forca', 'agilidade', 'vitalidade', 'inteligencia', 'percepcao'];
export const ATTRIBUTE_LABELS = {forca:'Força',agilidade:'Agilidade',vitalidade:'Vitalidade',inteligencia:'Inteligência',percepcao:'Percepção'};
export const RARITY = {
  comum: {name:'Comum',color:'#cbd5e1',mult:1},
  incomum: {name:'Incomum',color:'#65dcac',mult:1.2},
  raro: {name:'Raro',color:'#71b6ff',mult:1.52},
  epico: {name:'Épico',color:'#bc8bff',mult:1.95},
  lendario: {name:'Lendário',color:'#f8c36b',mult:2.55}
};
export const ITEMS = [
  { id:'lamina-fenda',name:'Lâmina da Fenda',slot:'arma',base:7,stats:{forca:1},description:'Um corte que ressoa no vazio.' },
  { id:'garras-nevoa',name:'Garras da Névoa',slot:'arma',base:5,stats:{agilidade:2},description:'Leves e precisas.' },
  { id:'escudo-arcano',name:'Couraça do Eco',slot:'armadura',base:25,stats:{vitalidade:2},description:'Armadura impregnada de runas.' },
  { id:'manto-vigia',name:'Manto da Vigília',slot:'armadura',base:14,stats:{agilidade:1,percepcao:1},description:'Revestimento de caçadores.' },
  { id:'anel-alvorada',name:'Anel da Aurora',slot:'anel',base:9,stats:{inteligencia:2},description:'Canaliza energia espiritual.' },
  { id:'selo-abismo',name:'Selo Abissal',slot:'anel',base:8,stats:{forca:1,percepcao:1},description:'Reage ao perigo.' }
];
export const SKILLS = [
  {id:'corte',key:'1',name:'Corte espectral',desc:'Golpe frontal amplo.',cost:12,cooldown:3.2,unlock:1},
  {id:'ruptura',key:'2',name:'Ruptura',desc:'Dano em área e atordoamento.',cost:25,cooldown:10,unlock:3},
  {id:'passo',key:'3',name:'Passo sombrio',desc:'Avanço evasivo com dano.',cost:15,cooldown:6.5,unlock:2},
  {id:'dreno',key:'4',name:'Dreno vital',desc:'Recupera PV ao atingir um inimigo.',cost:30,cooldown:13,unlock:5}
];
export const ENEMY_TYPES = {
  errante:{name:'Errante', hp:54,speed:2.6,attack:8,range:1.65,xp:18,gold:9,color:0x8194aa,radius:0.8},
  vigia:{name:'Vigia de obsidiana',hp:108,speed:1.6,attack:14,range:2.0,xp:32,gold:16,color:0x9d6eb1,radius:1.2},
  espectro:{name:'Espectro da Fenda',hp:62,speed:2.9,attack:11,range:1.7,xp:25,gold:14,color:0x65e6e1,radius:0.85},
  boss:{name:'Arconte da Ruptura',hp:850,speed:2.4,attack:23,range:2.7,xp:280,gold:200,color:0xff6b94,radius:1.8}
};
export const GATE_RANKS = ['E','D','C','B','A','S'];
export const CHUNK_SIZE = 24;
export const LOADED_RADIUS = 1;
