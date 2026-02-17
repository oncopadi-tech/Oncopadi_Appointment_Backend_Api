import Database from '@ioc:Adonis/Lucid/Database'
import { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/DatabaseQueryBuilder'
import {
  LucidRow,
  LucidModel,
  ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Model'
import { RelationshipsContract } from '@ioc:Adonis/Lucid/Relations'
import { scope } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

type Query =
  | ModelQueryBuilderContract<LucidModel>
  | DatabaseQueryBuilderContract<LucidModel>

export const search = (defaultColumns: string[], model: LucidModel) =>
  scope((query, search: string, columns?: string[]) => {
    columns = columns ? columns : defaultColumns

    for (const index in columns) {
      var column = columns[index]
      const isFirstColumn = Number(index) < 1
      const sections: Array<any> = column.split('.')

      column = sections[sections.length - 1]
      sections.splice(sections.length - 1, 1)

      queryNestedRelations(
        query,
        model,
        sections,
        (q) => (isFirstColumn ? q.whereIn : q.orWhereIn),
        (subQ) =>
          isFirstColumn && sections.length > 0
            ? subQ.where(column, 'LIKE', `%${search}%`)
            : subQ.orWhere(column, 'LIKE', `%${search}%`)
      )
    }
  })

/**
 * Sample Output Query
 * collectors.collections.name generates:
 * subQuery = Database.from('collectors')
 * subquery1 = Database.from('collections').select('collectors.ollector_id').where('name', 'LIKE', `%search%`)
 * subQuery.whereIn('collectors.id', subquery1)
 * subQuery.select('collectors.id')
 * subQuery = Database.from('collector_user').whereIn('collector_id', subQuery).select('user_id')
 * query.whereIn('users.id', subQuery)
 */

export function queryNestedRelations(
  query: Query,
  model: LucidModel,
  sections: string[],
  onQuery?: (query: Query) => (column: any, subQuery: Query) => any,
  onSubQuery?: (subQuery: Query) => any
) {
  if (sections.length < 1) {
    if (onSubQuery) {
      onSubQuery(query)
    }
    return
  }
  const relation: any = sections[0]
  const next: any = sections[0 + 1]
  sections.splice(0, 1)

  const relationship: RelationshipsContract = new model().related(relation)
    .relation

  if (!relationship)
    throw new Error(`${relation} does not exist on model ${model.name}`)

  const relatedTable = relationship.relatedModel().table
  var subQuery = Database.from(relatedTable)

  // if a nested relation exists then recursively modify the subquery otherwise perform search
  if (!!next) {
    queryNestedRelations(
      subQuery,
      relationship.model,
      sections,
      onQuery,
      onSubQuery
    )
  } else if (onSubQuery) {
    onSubQuery(subQuery)
  }

  var localKey = 'id'

  if (relationship.type === 'belongsTo') {
    subQuery.select(`${relatedTable}.${relationship.localKey}`)
    localKey = relationship['foreignKeyColumName']
  } else if (
    relationship.type === 'hasMany' ||
    relationship.type === 'hasOne'
  ) {
    subQuery.select(`${relatedTable}.${relationship['foreignKeyColumName:']}`)
    localKey = relationship.localKey
  } else if (relationship.type === 'manyToMany') {
    subQuery.select(`${relatedTable}.${relationship.relatedKey}`)
    subQuery = Database.from(relationship.pivotTable)
      .whereIn(
        `${relationship.pivotTable}.${relationship.pivotRelatedForeignKey}`,
        subQuery
      )
      .select(`${relationship.pivotTable}.${relationship.pivotForeignKey}`)
    localKey = relationship.localKey
  }

  const modelColumn: any = `${model.table}.${localKey}`

  if (onQuery) {
    query[onQuery(query).name](modelColumn, subQuery)
  } else {
    query.whereIn(modelColumn, subQuery)
  }
}

export async function restore(model: LucidModel, id: number) {
  await Database.from(model.table).where('id', id).update('deleted_at', null)

  return model.findOrFail(id)
}

export async function softDelete(row: LucidRow) {
  row['deletedAt'] = DateTime.local()
  await row.save()
}

export const softDeleteQuery = (query: Query, isDeleted = true) => {
  if (isDeleted) {
    query.whereNotNull('deleted_at')
  } else {
    query.whereNull('deleted_at')
  }
}
