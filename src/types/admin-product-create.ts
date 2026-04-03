export interface ProductAttributeFormRow {
  id: string
  attributeId: string
  displayOrder: number
  valueText: string
  valueNumber: string
  valueBoolean: boolean
  valueJson: string
  valueMultiText: string[]
  overrideUnit: string
}
