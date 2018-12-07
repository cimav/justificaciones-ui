export class Empleado {
  id: number;
  nombre: string;
  cuenta_cimav: string;
}

export class Tipo {
  id: number;
  code: string;
  fraccion: number;
  romano: string;
  texto: string;
}

export class Moneda {
  id: number;
  code: string;
  /* descripcion: string; */
  simbolo: string;
  nombre: string;
}

export class Partida {
  id: number;
  nombre: string;
  texto: string;
  tipo_id: number;
}

export class ProveedorNetmultix {
  clave: string;
  rfc: string;
  razon_social: string;
  contacto: string;
  domicilio: string;
  telefono: string;
  email: string;
  banco: string;
}

export class Proveedor {
  id: number;
  justificacion_id: number;
  clave: string;
  rfc: string;
  razon_social: string;
  contacto: string;
  domicilio: string;
  telefono: string;
  email: string;
  banco: string;
  cumple_tecnicas: string;
  cantidad_surtir: string;
  monto: number;
  fuente: number;
  es_nacional: false;
}

export class Justificacion {

  id: number;

  tipo: Tipo;
  creador: Empleado;
  autorizo: Empleado;
  elaboro: Empleado;
  moneda: Moneda;
  partida: Partida;

  proveedor_id: number;
  proveedor_selected: Proveedor;

  proveedores: Proveedor[];

  tipo_id: number;
  creador_id: number;
  elaboro_id: number;
  autorizo_id: number;
  moneda_id: number;
  partida_id: number;

  identificador: string;
  requisicion: string;
  proyecto: string;
  bien_servicio: number;
  subtotal: number;
  iva: number;
  importe: number;
  condiciones_pago: string;
  razon_compra: string;
  terminos_entrega: string;
  lugar_entrega: string;
  plazo: number;
  fecha_inicio:  Date;
  fecha_termino: Date;
  fecha_elaboracion: Date;
  descripcion: string;
  num_dias_plazo: number;
  num_pagos: number;
  porcen_anticipo: number;
  porcen_garantia: number;
  autoriza_cargo: string;
  forma_pago: string;
  motivo_seleccion: string;
  es_nacional: boolean;

  economica: boolean;
  eficiencia_eficacia: number;

  fecha_cotizar: Date;

  creador_cuenta_cimav: string;
  
  constructor() {
    this.requisicion = '';
    this.proyecto = '';
    this.condiciones_pago = '';
    this.terminos_entrega = '';
    this.plazo = 0;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.importe = 0.00;
    this.bien_servicio = 0;

    this.fecha_inicio =  new Date(); // .toLocaleString("en-US", {timeZone: "America/New_York"}) "es-MX" : "dd/MM/yyyy",
    this.fecha_termino = new Date();
    this.fecha_elaboracion = new Date();

    this.descripcion = '';
    this.num_dias_plazo = 1;
    this.num_pagos = 1;
    this.porcen_anticipo = 0;
    this.autoriza_cargo = 'RESPONSABLE DEL PROYECTO';
    this.forma_pago = '';

    this.motivo_seleccion = '';

    this.es_nacional = true;

    this.economica = true;
    this.eficiencia_eficacia = 0;

    this.fecha_cotizar = new Date();

    this.porcen_garantia = 0;
    this.fecha_cotizar = new Date();

    this.fecha_cotizar = new Date();

  }

}

export class Requisicion {
  requisicion: string;
  cve_responsable: number;
  fecha_requisicion: Date;
  cve_solicitante: number;
  req_status: number;
  cve_creador: number;
  partida: number;
  descripcion: string;
  renglon: number;
  proyecto: string;
  renglo_status: number;
}
