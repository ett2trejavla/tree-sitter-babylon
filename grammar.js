module.exports = grammar({
  name: "babylon",

  extras: ($) => [/\s/],

  word: ($) => $.upper_ident,

  rules: {
    schema: ($) => repeat($.type_definition),

    type_definition: ($) =>
      seq(field("name", $.upper_ident), ":", field("type", $._type)),

    _type: ($) =>
      choice(
        $.primitive_type,
        $.list_type,
        $.map_type,
        $.record_type,
        $.tag_union,
        $.type_reference,
      ),

    primitive_type: ($) =>
      choice(
        "I8",
        "U8",
        "I16",
        "U16",
        "I32",
        "U32",
        "I64",
        "U64",
        "I128",
        "U128",
        "F32",
        "F64",
        "Str",
        "Bool",
      ),

    list_type: ($) => seq("List", field("element", $._type)),

    map_type: ($) =>
      seq("Map", field("key", $._type), field("value", $._type)),

    record_type: ($) =>
      seq(
        "{",
        optional(
          seq(
            $.record_field,
            repeat(seq(",", $.record_field)),
            optional(","),
          ),
        ),
        "}",
        optional($.open_modifier),
      ),

    record_field: ($) =>
      seq(
        field("name", $.lower_ident),
        optional("?"),
        ":",
        field("type", $._type),
      ),

    tag_union: ($) =>
      seq(
        "[",
        optional(
          seq(
            $.tag_variant,
            repeat(seq(",", $.tag_variant)),
            optional(","),
          ),
        ),
        "]",
        optional($.open_modifier),
      ),

    tag_variant: ($) =>
      seq(
        field("name", $.upper_ident),
        optional(field("payload", $._type)),
      ),

    type_reference: ($) => $.upper_ident,

    open_modifier: (_) => "*",

    upper_ident: (_) => /[A-Z][a-zA-Z0-9]*/,
    lower_ident: (_) => /[a-z][a-zA-Z0-9]*/,
  },
});
